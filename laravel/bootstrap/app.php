<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Bootstrap protected PHP credentials (Zero .env architecture)
$credentialsFile = dirname(__DIR__) . '/config/credentials.php';
if (file_exists($credentialsFile)) {
    $isTesting = (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'testing')
              || (isset($_ENV['APP_ENV']) && $_ENV['APP_ENV'] === 'testing');
    $creds = require $credentialsFile;
    if (is_array($creds)) {
        foreach ($creds as $key => $value) {
            $envKey = strtoupper($key);
            if ($isTesting && in_array($envKey, [
                'APP_ENV',
                'APP_URL',
                'DB_CONNECTION',
                'DB_DATABASE',
                'DB_HOST',
                'DB_PORT',
                'DB_USERNAME',
                'DB_PASSWORD',
                'SESSION_DRIVER',
                'CACHE_STORE',
            ], true)) {
                continue;
            }
            $strValue = is_array($value) ? implode(',', $value) : (is_bool($value) ? ($value ? 'true' : 'false') : (string)$value);
            putenv("{$envKey}={$strValue}");
            $_ENV[$envKey] = $strValue;
            $_SERVER[$envKey] = $strValue;
        }
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'restrict.ip' => \App\Http\Middleware\RestrictIpAddress::class,
        ]);
        $middleware->redirectGuestsTo('/admin/login');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
