<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictIpAddress
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $clientIp = $this->resolveClientIp($request);
        $allowedIps = config('security.allowed_ips', ['127.0.0.1', '::1']);

        // Check if allowed list is empty (failsafe: allow local) or matches
        if (!empty($allowedIps) && !$this->isIpAllowed($clientIp, $allowedIps)) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'error' => 'Access Denied: Your IP address (' . $clientIp . ') is not authorized to access this resource.',
                    'client_ip' => $clientIp,
                ], 403);
            }

            return response()->view('admin.errors.403', [
                'clientIp' => $clientIp,
            ], 403);
        }

        return $next($request);
    }

    /**
     * Extract real client IP behind Imperva Incapsula / Cloudflare / Load Balancers.
     */
    public function resolveClientIp(Request $request): string
    {
        $headers = config('security.client_ip_headers', []);
        foreach ($headers as $header) {
            $val = $request->server($header);
            if (!empty($val)) {
                // If comma separated (e.g. X-Forwarded-For)
                $ips = explode(',', $val);
                $firstIp = trim($ips[0]);
                if (filter_var($firstIp, FILTER_VALIDATE_IP)) {
                    return $firstIp;
                }
            }
        }

        return $request->ip() ?: '0.0.0.0';
    }

    /**
     * Verify whether an IP matches an allowed list (supports exact IP and CIDR).
     */
    protected function isIpAllowed(string $ip, array $allowedList): bool
    {
        foreach ($allowedList as $allowed) {
            $allowed = trim($allowed);
            if ($allowed === '' || $allowed === '*') {
                return true;
            }

            // Exact match (IPv4 or IPv6)
            if ($ip === $allowed) {
                return true;
            }

            // CIDR notation check (IPv4)
            if (str_contains($allowed, '/')) {
                if ($this->cidrMatch($ip, $allowed)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if IPv4 matches CIDR mask.
     */
    protected function cidrMatch(string $ip, string $cidr): bool
    {
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return false;
        }

        [$subnet, $mask] = explode('/', $cidr, 2);
        if (!filter_var($subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return false;
        }

        $mask = (int)$mask;
        if ($mask < 0 || $mask > 32) {
            return false;
        }

        $ipLong = ip2long($ip);
        $subnetLong = ip2long($subnet);
        $maskLong = -1 << (32 - $mask);

        return ($ipLong & $maskLong) === ($subnetLong & $maskLong);
    }
}
