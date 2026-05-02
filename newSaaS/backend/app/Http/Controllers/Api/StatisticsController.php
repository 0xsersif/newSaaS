<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StatisticsService;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    protected $statisticsService;

    public function __construct(StatisticsService $statisticsService)
    {
        $this->statisticsService = $statisticsService;
    }

    public function tenantStats(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $stats = $this->statisticsService->getTenantStatistics($tenant);

        return response()->json($stats);
    }

    public function superAdminStats(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $stats = $this->statisticsService->getSuperAdminStatistics();

        return response()->json($stats);
    }
}
