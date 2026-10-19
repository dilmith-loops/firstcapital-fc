<?php
/**
 * First Capital Holdings PLC - Database Configuration Template
 * 
 * Instructions:
 * 1. Copy this file to 'db_config.php' in the same folder, OR to '../secure_config/db_config.php'.
 * 2. Update with your MySQL credentials from your hosting database management panel.
 */

if (!defined('FC_SECURITY_TOKEN')) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

return [
    'DB_HOST' => 'localhost',
    'DB_PORT' => '3306',
    'DB_NAME' => 'firstcapital_investor',
    'DB_USER' => 'firstcapital_user',
    'DB_PASS' => 'your_db_password_here',
    'ADMIN_SETUP_TOKEN' => 'generate_a_random_32_char_token_here',
];
