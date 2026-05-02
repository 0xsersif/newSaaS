<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Tenant;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        $domain = $request->header('X-Tenant-Domain');
        
        if (!$domain) {
            // For API requests, tenant is identified via authenticated user
            if ($request->user() && $request->user()->tenant_id) {
                $request->attributes->put('tenant', $request->user()->tenant);
            }
            return $next($request);
        }

        // For public store routes, identify tenant by domain
        $tenant = Tenant::where('custom_domain', $domain)
            ->orWhere('domain', $domain)
            ->first();

        if ($tenant) {
            $request->attributes->put('tenant', $tenant);
        }

        return $next($request);
    }
}
