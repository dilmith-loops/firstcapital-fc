<?php
/**
 * First Capital Holdings PLC - Master Security & Application Credentials
 * 
 * STRICT ARCHITECTURAL DIRECTIVE:
 * This project DOES NOT use any .env files.
 * All credentials (database connection, application encryption key, IP whitelist,
 * and admin tokens) are secured in this protected PHP configuration file.
 * 
 * Direct HTTP requests to this file are immediately blocked with HTTP 403 Forbidden.
 */

if (php_sapi_name() !== 'cli' && !defined('LARAVEL_START') && !defined('FC_SECURITY_TOKEN')) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

return [
    // -------------------------------------------------------------------------
    // 1. Application & Deployment Identity
    // -------------------------------------------------------------------------
    'APP_NAME' => 'First Capital Investor Week',
    'APP_ENV' => 'production',
    'APP_KEY' => 'base64:p8YjnIuDAB8fyIxP99ZSs8k4YaAXBsORBGK2ZcoE9l4=',
    'APP_DEBUG' => false,
    'APP_URL' => 'https://ai.loopsintegrated.co/fc',
    'ASSET_URL' => '/fc',

    // -------------------------------------------------------------------------
    // 2. MySQL / Database Connection Credentials
    // Change DB_CONNECTION to 'mysql' on production server.
    // -------------------------------------------------------------------------
    'DB_CONNECTION' => file_exists(dirname(__DIR__) . '/database/database.sqlite') ? 'sqlite' : 'mysql',
    'DB_HOST' => '127.0.0.1',
    'DB_PORT' => '3306',
    'DB_DATABASE' => file_exists(dirname(__DIR__) . '/database/database.sqlite')
        ? dirname(__DIR__) . '/database/database.sqlite'
        : 'firstcapital_investor',
    'DB_USERNAME' => 'firstcapital_user',
    'DB_PASSWORD' => 'your_db_password_here',

    // -------------------------------------------------------------------------
    // 3. Session & Caching
    // -------------------------------------------------------------------------
    'SESSION_DRIVER' => 'database',
    'SESSION_LIFETIME' => 120,
    'CACHE_STORE' => 'database',

    // -------------------------------------------------------------------------
    // 4. Perimeter Security & IP Whitelisting Gatekeeper
    // Comma-separated IP addresses or CIDR blocks allowed to access /admin/
    // -------------------------------------------------------------------------
    'ADMIN_ALLOWED_IPS' => '112.134.215.162, 127.0.0.1, ::1',

    // -------------------------------------------------------------------------
    // 5. One-Time Administrator Bootstrap Setup Token
    // Required only to create the initial Super Admin account at /admin/setup
    // -------------------------------------------------------------------------
    'ADMIN_SETUP_TOKEN' => '4c1cfd0a644ce9f9d8d9dffb358e59dd5dde532b59a525eb',
];
