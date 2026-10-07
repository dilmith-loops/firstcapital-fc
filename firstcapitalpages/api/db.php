<?php
// Hostinger MySQL Database Configuration
// Update these 4 values with your Hostinger MySQL details from hPanel -> Databases

define('DB_HOST', 'localhost');
define('DB_NAME', 'u451149423_firstcapital');     // Hostinger DB name
define('DB_USER', 'u451149423_firstcapital');     // Hostinger DB user
define('DB_PASS', '3Sr>26Wr');                 // Hostinger DB password

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (Throwable $e) {
            $pdo = false;
        }
    }
    return $pdo ? $pdo : null;
}
