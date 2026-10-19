<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Admin IP Whitelisting Gatekeeper
    |--------------------------------------------------------------------------
    | Specify IP addresses or CIDR blocks allowed to access the /admin portal.
    | Public quiz visitors (0.0.0.0/0) are never affected by this whitelist.
    */
    'allowed_ips' => array_filter(array_map('trim', explode(',', env('ADMIN_ALLOWED_IPS', '112.134.215.162, 127.0.0.1, ::1')))),

    /*
    |--------------------------------------------------------------------------
    | One-Time Administrator Bootstrap Setup Token
    |--------------------------------------------------------------------------
    | Used strictly to create the initial Super Admin account at /admin/setup.
    | Automatically deactivated once an active Super Admin exists in MySQL.
    */
    'setup_token' => env('ADMIN_SETUP_TOKEN', '4c1cfd0a644ce9f9d8d9dffb358e59dd5dde532b59a525eb'),

    /*
    |--------------------------------------------------------------------------
    | Reverse Proxy Header Precedence
    |--------------------------------------------------------------------------
    | firstcapital.lk is protected by Imperva Incapsula WAF.
    */
    'client_ip_headers' => [
        'HTTP_INCAP_CLIENT_IP',
        'HTTP_CF_CONNECTING_IP',
        'HTTP_X_FORWARDED_FOR',
    ],
];
