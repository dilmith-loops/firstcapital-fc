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
    if ($pdo === null) {
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $port = (defined('DB_PORT') && DB_PORT) ? ';port=' . DB_PORT : '';
            $dsn = "mysql:host=" . DB_HOST . $port . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (Throwable $e) {
            // Log securely without leaking credentials into user HTTP responses
            error_log("Database connection failed: " . $e->getMessage());
            $pdo = null;
        }
    }
    return $pdo;
}
