<?php
/**
 * First Capital Holdings PLC - Database & Security Configuration
 * 
 * SECURITY DIRECTIVE:
 * This file contains production database credentials. Direct web requests to this file
 * are rejected immediately with HTTP 403 Forbidden.
 * 
 * RECOMMENDATION FOR HIGHEST SECURITY:
 * On cPanel / Hostinger, move this file to a directory OUTSIDE public_html
 * (e.g., /home/username/secure_config/db_config.php) so no web request can ever access it.
 */

if (!defined('FC_SECURITY_TOKEN')) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

return [
    // -------------------------------------------------------------------------
    // 1. MySQL Database Connection Credentials
    // -------------------------------------------------------------------------
    'DB_HOST' => 'localhost',
    'DB_PORT' => '3306',
    'DB_NAME' => 'firstcapital_investor',
    'DB_USER' => 'firstcapital_user',
    'DB_PASS' => 'your_db_password_here',

    // -------------------------------------------------------------------------
    // 2. One-Time Admin Setup Token
    // Required ONLY to create the initial Super Admin account at /admin/.
    // Automatically stops functioning once an active Super Admin exists in MySQL.
    // -------------------------------------------------------------------------
    'ADMIN_SETUP_TOKEN' => '4c1cfd0a644ce9f9d8d9dffb358e59dd5dde532b59a525eb',
];
