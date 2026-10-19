<?php
// Shared security helpers for the API: JSON responses, admin sessions,
// same-origin checks, rate limiting and settings validation.

require_once __DIR__ . '/db.php';

// Settings the public site reads (questions, results, testimonials, reasons, products).
// Anything else stored in app_settings is never returned.
const PUBLIC_SETTING_KEYS = ['quiz_questions', 'quiz_results', 'testimonials', 'why_first_capital', 'investment_products'];
const MAX_SETTING_BYTES = 1048576;
const ADMIN_SESSION_IDLE_SECONDS = 7200;

function sendSecurityHeaders() {
    @header_remove('X-Powered-By');
    @ini_set('expose_php', 'off');
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    header('Referrer-Policy: same-origin');
}

function jsonResponse($status, $payload) {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function readJsonBody() {
    $raw = file_get_contents('php://input', false, null, 0, MAX_SETTING_BYTES + 1024);
    $data = json_decode($raw ?: '', true);
    return is_array($data) ? $data : [];
}

function clientIp() {
    $remote = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    // Check if REMOTE_ADDR is a private / loopback IP (traffic arrived via internal reverse-proxy or load balancer)
    $isInternalProxy = !filter_var(
        $remote,
        FILTER_VALIDATE_IP,
        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    );

    // Only inspect forwarded headers if the immediate connection is from an internal proxy
    if ($isInternalProxy) {
        // 1. Imperva Incapsula edge IP (firstcapital.lk WAF provider)
        if (!empty($_SERVER['HTTP_INCAP_CLIENT_IP']) && filter_var($_SERVER['HTTP_INCAP_CLIENT_IP'], FILTER_VALIDATE_IP)) {
            return $_SERVER['HTTP_INCAP_CLIENT_IP'];
        }

        // 2. Cloudflare Connecting IP
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP']) && filter_var($_SERVER['HTTP_CF_CONNECTING_IP'], FILTER_VALIDATE_IP)) {
            return $_SERVER['HTTP_CF_CONNECTING_IP'];
        }

        // 3. Standard Forwarded For (First IP in chain)
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $firstIp = trim($ips[0]);
            if (filter_var($firstIp, FILTER_VALIDATE_IP)) {
                return $firstIp;
            }
        }
    }

    // Direct connection without proxy: use REMOTE_ADDR directly to prevent spoofing
    return $remote;
}

function isHttps() {
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
        || ((int)($_SERVER['SERVER_PORT'] ?? 0) === 443);
}

// Base path of the site (e.g. /begininvesting/) derived from /<base>/api/<script>.php
function siteBasePath() {
    $script = $_SERVER['SCRIPT_NAME'] ?? '/api/leads.php';
    $base = preg_replace('#/api/[^/]+$#', '/', $script);
    return ($base && $base[0] === '/') ? $base : '/';
}

// Reject state-changing requests that come from another site (CSRF defence in depth;
// the session cookie is also SameSite=Strict).
function requireSameOrigin() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        if ($referer === '') return;
        $origin = $referer;
    }
    $originHost = parse_url($origin, PHP_URL_HOST);
    $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    if (!$originHost || strcasecmp($originHost, $host) !== 0) {
        jsonResponse(403, ['success' => false, 'error' => 'Cross-origin request blocked.']);
    }
}

function startAdminSession() {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('FCADMINSESS');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => siteBasePath(),
        'secure' => isHttps(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();

    if (!empty($_SESSION['admin_id'])) {
        $last = (int)($_SESSION['last_seen'] ?? 0);
        if ($last && (time() - $last) > ADMIN_SESSION_IDLE_SECONDS) {
            $_SESSION = [];
            session_destroy();
            session_start();
        } else {
            $_SESSION['last_seen'] = time();
        }
    }
}

// Returns the logged-in, still-active admin row, or null.
function currentAdmin($pdo) {
    startAdminSession();
    $id = (int)($_SESSION['admin_id'] ?? 0);
    if (!$id || !$pdo) return null;
    try {
        $stmt = $pdo->prepare("SELECT id, name, email, role, status, created_at, last_login FROM admin_accounts WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row || $row['status'] !== 'Active') return null;
        return $row;
    } catch (Throwable $e) {
        return null;
    }
}

function requireAdmin($pdo, $superAdminOnly = false) {
    $admin = currentAdmin($pdo);
    if (!$admin) {
        jsonResponse(401, ['success' => false, 'error' => 'Authentication required.']);
    }
    if ($superAdminOnly && $admin['role'] !== 'Super Admin') {
        jsonResponse(403, ['success' => false, 'error' => 'Super Admin access required.']);
    }
    return $admin;
}

function publicAdmin($row) {
    return [
        'id' => (string)$row['id'],
        'name' => $row['name'],
        'email' => $row['email'],
        'role' => $row['role'],
        'status' => $row['status'],
        'createdAt' => $row['created_at'],
        'lastLogin' => $row['last_login'],
    ];
}

// Fixed-window rate limit per bucket + client IP. Returns true when the request is allowed.
function rateLimit($pdo, $bucket, $max, $windowSeconds) {
    if (!$pdo) return true;
    $key = substr($bucket . ':' . hash('sha256', clientIp()), 0, 191);
    $now = time();
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    try {
        $stmt = $pdo->prepare("SELECT hits, window_start FROM rate_limits WHERE k = :k");
        $stmt->execute([':k' => $key]);
        $row = $stmt->fetch();
        if (!$row || ($now - (int)$row['window_start']) >= $windowSeconds) {
            if ($driver === 'sqlite') {
                $up = $pdo->prepare("INSERT INTO rate_limits (k, hits, window_start) VALUES (:k, 1, :t) ON CONFLICT(k) DO UPDATE SET hits = 1, window_start = excluded.window_start");
            } else {
                $up = $pdo->prepare("INSERT INTO rate_limits (k, hits, window_start) VALUES (:k, 1, :t) ON DUPLICATE KEY UPDATE hits = 1, window_start = VALUES(window_start)");
            }
            $up->execute([':k' => $key, ':t' => $now]);
            return true;
        }
        if ((int)$row['hits'] >= $max) return false;
        $inc = $pdo->prepare("UPDATE rate_limits SET hits = hits + 1 WHERE k = :k");
        $inc->execute([':k' => $key]);
        return true;
    } catch (Throwable $e) {
        return true;
    }
}

function clearRateLimit($pdo, $bucket) {
    if (!$pdo) return;
    try {
        $stmt = $pdo->prepare("DELETE FROM rate_limits WHERE k = :k");
        $stmt->execute([':k' => substr($bucket . ':' . hash('sha256', clientIp()), 0, 191)]);
    } catch (Throwable $e) {}
}

// Any value stored under a URL-like key must be an absolute http(s) URL, so content
// written by an admin can never inject javascript:/data: links into the public pages.
function settingsUrlsAreSafe($value, $parentKey = '') {
    if (is_array($value)) {
        foreach ($value as $k => $v) {
            if (!settingsUrlsAreSafe($v, is_string($k) ? $k : $parentKey)) return false;
        }
        return true;
    }
    if (is_string($value) && preg_match('/(^url$|url$|^href$|^link$)/i', $parentKey) && trim($value) !== '') {
        return (bool)preg_match('#^https?://#i', trim($value));
    }
    return true;
}

function ensureSecurityTables($pdo) {
    if (!$pdo) return;
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    try {
        if ($driver === 'sqlite') {
            $pdo->exec("CREATE TABLE IF NOT EXISTS admin_accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'Manager',
                status TEXT NOT NULL DEFAULT 'Active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login DATETIME NULL DEFAULT NULL
            );");

            $pdo->exec("CREATE TABLE IF NOT EXISTS rate_limits (
                k TEXT PRIMARY KEY,
                hits INTEGER NOT NULL DEFAULT 0,
                window_start INTEGER NOT NULL
            );");
        } else {
            $pdo->exec("CREATE TABLE IF NOT EXISTS `admin_accounts` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `name` VARCHAR(100) NOT NULL,
                `email` VARCHAR(150) NOT NULL UNIQUE,
                `password_hash` VARCHAR(255) NOT NULL,
                `role` VARCHAR(30) NOT NULL DEFAULT 'Manager',
                `status` VARCHAR(20) NOT NULL DEFAULT 'Active',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `last_login` TIMESTAMP NULL DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `rate_limits` (
                `k` VARCHAR(191) PRIMARY KEY,
                `hits` INT NOT NULL DEFAULT 0,
                `window_start` INT NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
        }

        // The old client-side admin list (with plain-text passwords) was stored here; remove it.
        try {
            $pdo->exec("DELETE FROM app_settings WHERE setting_key = 'admin_users'");
        } catch (Throwable $e) {}

        // Security Hardening: Never auto-seed default passwords (SEC-AUD-02).
        // First-time setup is executed securely via /admin/ with ADMIN_SETUP_TOKEN.
    } catch (Throwable $e) {
        error_log("ensureSecurityTables error: " . $e->getMessage());
    }
}
