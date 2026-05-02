<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckTenantAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Super admins can access everything
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Other users must have a tenant
        if (!$user->tenant_id) {
            return response()->json(['message' => 'No store associated with this account'], 403);
        }

        // Verify tenant is active
        if (!$user->tenant->isActive()) {
            return response()->json(['message' => 'Store subscription has expired'], 403);
        }

        return $next($request);
    }
}
