<?php
// Hostinger MySQL Database Configuration
// Update these 4 values with your Hostinger MySQL details from hPanel -> Databases or .env

// Load credentials from .env if present
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

if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: 'u451149423_firstcapital');     // Hostinger DB name
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: 'u451149423_firstcapital');     // Hostinger DB user
if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS') ?: (getenv('DB_PASSWORD') ?: '3Sr>26Wr')); // Hostinger DB password

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        // 1. Primary connection: Hostinger production MySQL
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (Throwable $e) {
            // 2. Local fallback for development (XAMPP MySQL port 3307 or 3306)
            try {
                $dsnLocal = "mysql:host=127.0.0.1;port=3307;dbname=" . DB_NAME . ";charset=utf8mb4";
                $pdo = new PDO($dsnLocal, 'root', '', $options);
            } catch (Throwable $e2) {
                try {
                    $dsnLocal3306 = "mysql:host=127.0.0.1;port=3306;dbname=" . DB_NAME . ";charset=utf8mb4";
                    $pdo = new PDO($dsnLocal3306, 'root', '', $options);
                } catch (Throwable $e3) {
                    $pdo = false;
                }
            }
        }
    }
    return $pdo ? $pdo : null;
}
