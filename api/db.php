<?php
/**
 * First Capital Holdings PLC - Database Connection Provider
 * 
 * Supports both dedicated PHP configuration files (db_config.php)
 * and legacy environment variables (.env).
 */

define('FC_SECURITY_TOKEN', 'fc_db_bootstrap_auth_2026');

// 1. Check for dedicated PHP configuration files (Inside or Outside web root)
$configPaths = [
    // External path above web root (Most secure, physically inaccessible via HTTP)
    __DIR__ . '/../../secure_config/db_config.php',
    __DIR__ . '/../secure_config/db_config.php',
    // Local project config path
    __DIR__ . '/db_config.php',
    __DIR__ . '/../db_config.php',
];

$config = null;
foreach ($configPaths as $path) {
    if (file_exists($path)) {
        $loaded = require $path;
        if (is_array($loaded)) {
            $config = $loaded;
            break;
        }
    }
}

if ($config) {
    foreach ($config as $k => $v) {
        if (!defined($k)) define($k, (string)$v);
        putenv("$k=$v");
        $_ENV[$k] = (string)$v;
    }
} else {
    // 2. Fallback to .env if db_config.php is not present
    $envPaths = [__DIR__ . '/.env', __DIR__ . '/../.env', __DIR__ . '/../../.env'];
    foreach ($envPaths as $envPath) {
        if (file_exists($envPath)) {
            $lines = @file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines) {
                foreach ($lines as $line) {
                    $line = trim($line);
                    if ($line === '' || strpos($line, '#') === 0) continue;
                    if (strpos($line, '=') !== false) {
                        list($name, $val) = explode('=', $line, 2);
                        $name = trim($name);
                        $val = trim($val, " \t\n\r\0\x0B\"'");
                        if (!defined($name)) {
                            define($name, $val);
                        }
                        putenv("$name=$val");
                        $_ENV[$name] = $val;
                    }
                }
            }
            break;
        }
    }
}

if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
if (!defined('DB_PORT')) define('DB_PORT', getenv('DB_PORT') ?: '3306');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: 'firstcapital_investor');
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: 'root');
if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS') ?: (getenv('DB_PASSWORD') ?: ''));

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    // 1. Attempt MySQL connection if real credentials are provided
    $dbPass = defined('DB_PASS') ? DB_PASS : '';
    $dbUser = defined('DB_USER') ? DB_USER : '';
    $dbName = defined('DB_NAME') ? DB_NAME : '';
    $dbHost = defined('DB_HOST') ? DB_HOST : 'localhost';
    $isPlaceholderPass = in_array($dbPass, ['', 'your_db_password_here', 'your_password_here'], true);

    if ($dbName !== '' && !$isPlaceholderPass) {
        try {
            $port = (defined('DB_PORT') && DB_PORT) ? ';port=' . DB_PORT : '';
            $dsn = "mysql:host=" . $dbHost . $port . ";dbname=" . $dbName . ";charset=utf8mb4";
            $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
            return $pdo;
        } catch (Throwable $e) {
            $GLOBALS['FC_DB_ERROR'] = "MySQL: " . $e->getMessage();
            error_log("MySQL connection failed: " . $e->getMessage() . " - switching to high-availability SQLite fallback.");
            $pdo = null;
        }
    }

    // 2. High-availability SQLite fallback (ensures zero downtime on Hostinger / shared hosting)
    try {
        $dataDir = __DIR__ . '/data';
        if (!is_dir($dataDir)) {
            @mkdir($dataDir, 0750, true);
            $ht = $dataDir . '/.htaccess';
            if (!file_exists($ht)) {
                @file_put_contents($ht, "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order deny,allow\n  Deny from all\n</IfModule>\n");
            }
        }
        @chmod($dataDir, 0750);

        $sqliteFile = $dataDir . '/database.sqlite';
        $pdo = new PDO('sqlite:' . $sqliteFile, null, null, $options);
        $pdo->exec('PRAGMA foreign_keys = ON;');
        $pdo->exec('PRAGMA journal_mode = WAL;');
        @chmod($sqliteFile, 0640);
        return $pdo;
    } catch (Throwable $e) {
        $GLOBALS['FC_DB_ERROR'] = ($GLOBALS['FC_DB_ERROR'] ?? '') . " | SQLite: " . $e->getMessage();
        error_log("SQLite database fallback failed: " . $e->getMessage());
        $pdo = null;
    }

    return $pdo;
}
