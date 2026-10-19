<?php
// Admin authentication and admin account management (server-side sessions).
//
//   GET  ?action=me               -> session state (+ whether first-time setup is needed)
//   POST ?action=login            -> { email, password }
//   POST ?action=logout
//   POST ?action=setup            -> { name, email, password, token } (only while no admin exists;
//                                    token must match ADMIN_SETUP_TOKEN in .env)
//   POST ?action=change_password  -> { currentPassword, newPassword }
//   GET  ?action=users            -> list admins (any admin)
//   POST ?action=user_create      -> Super Admin only
//   POST ?action=user_update      -> Super Admin only
//   POST ?action=user_delete      -> Super Admin only

require_once __DIR__ . '/security.php';

sendSecurityHeaders();

const ADMIN_ROLES = ['Super Admin', 'Manager', 'Wealth Advisor', 'Viewer'];
const MIN_PASSWORD_LENGTH = 10;

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$pdo = getDbConnection();
if (!$pdo) {
    jsonResponse(503, ['success' => false, 'error' => 'Service temporarily unavailable.']);
}
ensureSecurityTables($pdo);

if ($method !== 'GET') {
    requireSameOrigin();
}

function adminCount($pdo) {
    return (int)$pdo->query("SELECT COUNT(*) FROM admin_accounts")->fetchColumn();
}

function activeSuperAdminCount($pdo, $excludeId = 0) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin_accounts WHERE role = 'Super Admin' AND status = 'Active' AND id <> :id");
    $stmt->execute([':id' => $excludeId]);
    return (int)$stmt->fetchColumn();
}

function setupToken() {
    $token = defined('ADMIN_SETUP_TOKEN') ? ADMIN_SETUP_TOKEN : (getenv('ADMIN_SETUP_TOKEN') ?: '');
    return strlen($token) >= 16 ? $token : '';
}

function validPassword($password) {
    return is_string($password) && mb_strlen($password) >= MIN_PASSWORD_LENGTH && mb_strlen($password) <= 200;
}

function cleanText($value, $max) {
    return is_string($value) ? mb_substr(strip_tags(trim($value)), 0, $max) : '';
}

function logIn($admin) {
    startAdminSession();
    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int)$admin['id'];
    $_SESSION['last_seen'] = time();
}

// ----------------------------------------------------
// Session state
// ----------------------------------------------------
if ($action === 'me' && $method === 'GET') {
    $admin = currentAdmin($pdo);
    $needsSetup = adminCount($pdo) === 0;
    jsonResponse(200, [
        'success' => true,
        'authenticated' => (bool)$admin,
        'admin' => $admin ? publicAdmin($admin) : null,
        'setupRequired' => $needsSetup,
        'setupEnabled' => $needsSetup && setupToken() !== '',
    ]);
}

if ($action === 'login' && $method === 'POST') {
    if (!rateLimit($pdo, 'login', 10, 900)) {
        jsonResponse(429, ['success' => false, 'error' => 'Too many login attempts. Please wait 15 minutes and try again.']);
    }
    $data = readJsonBody();
    $email = strtolower(cleanText($data['email'] ?? '', 150));
    $password = is_string($data['password'] ?? null) ? $data['password'] : '';

    $stmt = $pdo->prepare("SELECT * FROM admin_accounts WHERE email = :e");
    $stmt->execute([':e' => $email]);
    $row = $stmt->fetch();

    // Hash something even for unknown emails so response time doesn't reveal which emails exist
    $hash = $row ? $row['password_hash'] : password_hash(bin2hex(random_bytes(8)), PASSWORD_DEFAULT);
    $ok = password_verify($password, $hash) && $row && $row['status'] === 'Active';
    if (!$ok) {
        jsonResponse(401, ['success' => false, 'error' => 'Invalid email or password.']);
    }

    if (password_needs_rehash($row['password_hash'], PASSWORD_DEFAULT)) {
        $up = $pdo->prepare("UPDATE admin_accounts SET password_hash = :h WHERE id = :id");
        $up->execute([':h' => password_hash($password, PASSWORD_DEFAULT), ':id' => $row['id']]);
    }
    $pdo->prepare("UPDATE admin_accounts SET last_login = NOW() WHERE id = :id")->execute([':id' => $row['id']]);
    clearRateLimit($pdo, 'login');
    logIn($row);
    jsonResponse(200, ['success' => true, 'admin' => publicAdmin($row)]);
}

if ($action === 'logout' && $method === 'POST') {
    startAdminSession();
    $_SESSION = [];
    session_destroy();
    jsonResponse(200, ['success' => true]);
}

if ($action === 'setup' && $method === 'POST') {
    if (!rateLimit($pdo, 'setup', 10, 900)) {
        jsonResponse(429, ['success' => false, 'error' => 'Too many attempts. Please wait 15 minutes and try again.']);
    }
    if (adminCount($pdo) > 0) {
        jsonResponse(409, ['success' => false, 'error' => 'Setup has already been completed.']);
    }
    $token = setupToken();
    $data = readJsonBody();
    if ($token === '' || !is_string($data['token'] ?? null) || !hash_equals($token, $data['token'])) {
        jsonResponse(403, ['success' => false, 'error' => 'Invalid setup token.']);
    }
    $name = cleanText($data['name'] ?? '', 100);
    $email = strtolower(cleanText($data['email'] ?? '', 150));
    $password = $data['password'] ?? '';
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !validPassword($password)) {
        jsonResponse(400, ['success' => false, 'error' => 'Enter a name, a valid email and a password of at least ' . MIN_PASSWORD_LENGTH . ' characters.']);
    }
    $stmt = $pdo->prepare("INSERT INTO admin_accounts (name, email, password_hash, role, status, last_login) VALUES (:n, :e, :h, 'Super Admin', 'Active', NOW())");
    $stmt->execute([':n' => $name, ':e' => $email, ':h' => password_hash($password, PASSWORD_DEFAULT)]);
    $row = ['id' => (int)$pdo->lastInsertId()];
    logIn($row);
    $admin = currentAdmin($pdo);
    jsonResponse(200, ['success' => true, 'admin' => publicAdmin($admin)]);
}

// ----------------------------------------------------
// Everything below requires a logged-in admin
// ----------------------------------------------------
if ($action === 'change_password' && $method === 'POST') {
    $admin = requireAdmin($pdo);
    $data = readJsonBody();
    $current = $data['currentPassword'] ?? '';
    $new = $data['newPassword'] ?? '';
    $stmt = $pdo->prepare("SELECT password_hash FROM admin_accounts WHERE id = :id");
    $stmt->execute([':id' => $admin['id']]);
    if (!is_string($current) || !password_verify($current, (string)$stmt->fetchColumn())) {
        jsonResponse(400, ['success' => false, 'error' => 'Current password is incorrect.']);
    }
    if (!validPassword($new)) {
        jsonResponse(400, ['success' => false, 'error' => 'New password must be at least ' . MIN_PASSWORD_LENGTH . ' characters.']);
    }
    $pdo->prepare("UPDATE admin_accounts SET password_hash = :h WHERE id = :id")
        ->execute([':h' => password_hash($new, PASSWORD_DEFAULT), ':id' => $admin['id']]);
    session_regenerate_id(true);
    jsonResponse(200, ['success' => true]);
}

if ($action === 'users' && $method === 'GET') {
    requireAdmin($pdo);
    $rows = $pdo->query("SELECT id, name, email, role, status, created_at, last_login FROM admin_accounts ORDER BY id")->fetchAll();
    jsonResponse(200, ['success' => true, 'users' => array_map('publicAdmin', $rows)]);
}

if ($action === 'user_create' && $method === 'POST') {
    requireAdmin($pdo, true);
    $data = readJsonBody();
    $name = cleanText($data['name'] ?? '', 100);
    $email = strtolower(cleanText($data['email'] ?? '', 150));
    $password = $data['password'] ?? '';
    $role = in_array($data['role'] ?? '', ADMIN_ROLES, true) ? $data['role'] : 'Manager';
    $status = ($data['status'] ?? 'Active') === 'Inactive' ? 'Inactive' : 'Active';
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !validPassword($password)) {
        jsonResponse(400, ['success' => false, 'error' => 'Enter a name, a valid email and a password of at least ' . MIN_PASSWORD_LENGTH . ' characters.']);
    }
    try {
        $stmt = $pdo->prepare("INSERT INTO admin_accounts (name, email, password_hash, role, status) VALUES (:n, :e, :h, :r, :s)");
        $stmt->execute([':n' => $name, ':e' => $email, ':h' => password_hash($password, PASSWORD_DEFAULT), ':r' => $role, ':s' => $status]);
    } catch (Throwable $e) {
        jsonResponse(409, ['success' => false, 'error' => 'An administrator with this email already exists.']);
    }
    $stmt = $pdo->prepare("SELECT id, name, email, role, status, created_at, last_login FROM admin_accounts WHERE id = :id");
    $stmt->execute([':id' => (int)$pdo->lastInsertId()]);
    jsonResponse(200, ['success' => true, 'user' => publicAdmin($stmt->fetch())]);
}

if ($action === 'user_update' && $method === 'POST') {
    requireAdmin($pdo, true);
    $data = readJsonBody();
    $id = (int)($data['id'] ?? 0);
    $stmt = $pdo->prepare("SELECT * FROM admin_accounts WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $target = $stmt->fetch();
    if (!$target) {
        jsonResponse(404, ['success' => false, 'error' => 'Administrator not found.']);
    }
    $name = cleanText($data['name'] ?? $target['name'], 100) ?: $target['name'];
    $role = in_array($data['role'] ?? '', ADMIN_ROLES, true) ? $data['role'] : $target['role'];
    $status = in_array($data['status'] ?? '', ['Active', 'Inactive'], true) ? $data['status'] : $target['status'];

    $losingSuperAdmin = $target['role'] === 'Super Admin' && $target['status'] === 'Active'
        && ($role !== 'Super Admin' || $status !== 'Active');
    if ($losingSuperAdmin && activeSuperAdminCount($pdo, $id) === 0) {
        jsonResponse(400, ['success' => false, 'error' => 'At least one active Super Admin is required.']);
    }

    $pdo->prepare("UPDATE admin_accounts SET name = :n, role = :r, status = :s WHERE id = :id")
        ->execute([':n' => $name, ':r' => $role, ':s' => $status, ':id' => $id]);

    $password = $data['password'] ?? '';
    if ($password !== '' && $password !== null) {
        if (!validPassword($password)) {
            jsonResponse(400, ['success' => false, 'error' => 'Password must be at least ' . MIN_PASSWORD_LENGTH . ' characters.']);
        }
        $pdo->prepare("UPDATE admin_accounts SET password_hash = :h WHERE id = :id")
            ->execute([':h' => password_hash($password, PASSWORD_DEFAULT), ':id' => $id]);
    }
    jsonResponse(200, ['success' => true]);
}

if ($action === 'user_delete' && $method === 'POST') {
    $admin = requireAdmin($pdo, true);
    $data = readJsonBody();
    $id = (int)($data['id'] ?? 0);
    if ($id === (int)$admin['id']) {
        jsonResponse(400, ['success' => false, 'error' => 'You cannot delete your own account.']);
    }
    $stmt = $pdo->prepare("SELECT role, status FROM admin_accounts WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $target = $stmt->fetch();
    if (!$target) {
        jsonResponse(404, ['success' => false, 'error' => 'Administrator not found.']);
    }
    if ($target['role'] === 'Super Admin' && $target['status'] === 'Active' && activeSuperAdminCount($pdo, $id) === 0) {
        jsonResponse(400, ['success' => false, 'error' => 'Cannot delete the only active Super Admin account.']);
    }
    $pdo->prepare("DELETE FROM admin_accounts WHERE id = :id")->execute([':id' => $id]);
    jsonResponse(200, ['success' => true]);
}

jsonResponse(400, ['success' => false, 'error' => 'Unknown action.']);
