<?php

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Support\Facades\DB;

class StatisticsService
{
    public function getTenantStatistics(Tenant $tenant)
    {
        $totalOrders = $tenant->orders()->count();
        $totalRevenue = $tenant->orders()->sum('total_amount');
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        $ordersByStatus = $tenant->orders()
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.tenant_id', $tenant->id)
            ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        $ordersByDate = $tenant->orders()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'), DB::raw('SUM(total_amount) as revenue'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();

        return [
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'average_order_value' => round($averageOrderValue, 2),
            'orders_by_status' => $ordersByStatus,
            'top_products' => $topProducts,
            'orders_by_date' => $ordersByDate,
            'total_products' => $tenant->products()->count(),
            'total_customers' => $tenant->customers()->count(),
            'conversion_rate' => $this->calculateConversionRate($tenant),
        ];
    }

    public function getSuperAdminStatistics()
    {
        $totalTenants = Tenant::count();
        $activeTenants = Tenant::where('status', 'active')->count();
        $totalOrders = DB::table('orders')->count();
        $totalRevenue = DB::table('orders')->sum('total_amount');

        $mrr = DB::table('tenants')
            ->whereNull('subscription_end_date')
            ->orWhere('subscription_end_date', '>', now())
            ->join('plans', 'tenants.plan_id', '=', 'plans.id')
            ->sum('plans.price');

        $churnRate = $this->calculateChurnRate();

        return [
            'total_tenants' => $totalTenants,
            'active_tenants' => $activeTenants,
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'mrr' => round($mrr, 2),
            'churn_rate' => round($churnRate, 2),
        ];
    }

    private function calculateConversionRate(Tenant $tenant): float
    {
        // This would need to track unique visitors - for now return placeholder
        return 0;
    }

    private function calculateChurnRate(): float
    {
        // Calculate percentage of tenants that cancelled last month
        $cancelledLastMonth = Tenant::where('status', 'inactive')
            ->whereBetween('updated_at', [now()->subMonth(), now()])
            ->count();

        $totalActiveLastMonth = Tenant::where('status', 'active')->count();

        return $totalActiveLastMonth > 0 ? ($cancelledLastMonth / $totalActiveLastMonth) * 100 : 0;
    }
}
