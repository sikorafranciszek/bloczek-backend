<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    /**
     * Display analytics page
     */
    public function index()
    {
        // Check if user is admin
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Access denied');
        }

        try {
            return Inertia::render('Analytics', [
                'dailyStats' => $this->getDailyStats(),
                'monthlyStats' => $this->getMonthlyStats(),
                'yearlyStats' => $this->getYearlyStats(),
                'overallStats' => $this->getOverallStats()
            ]);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Analytics error: ' . $e->getMessage());
            
            // Return with empty data if there's an error
            return Inertia::render('Analytics', [
                'dailyStats' => [],
                'monthlyStats' => ['data' => [], 'growth' => ['orders' => 0, 'revenue' => 0]],
                'yearlyStats' => [],
                'overallStats' => [
                    'total_orders' => 0,
                    'total_revenue' => 0,
                    'average_order_value' => 0,
                    'today_orders' => 0,
                    'today_revenue' => 0,
                    'month_orders' => 0,
                    'month_revenue' => 0,
                ]
            ]);
        }
    }

    /**
     * Get daily statistics for the last 30 days
     */
    private function getDailyStats()
    {
        try {
            $startDate = Carbon::now()->subDays(30);
            $endDate = Carbon::now();

            $dailyData = Order::where('status', 'PositiveFinish')
                ->whereNotNull('paid_at')
                ->where('paid_at', '>=', $startDate)
                ->select(
                    DB::raw('DATE(paid_at) as date'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(amount) as revenue')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Fill missing dates with zero values
            $result = [];
            $current = $startDate->copy();
            
            while ($current <= $endDate) {
                $dateStr = $current->format('Y-m-d');
                $dayData = $dailyData->firstWhere('date', $dateStr);
                
                $result[] = [
                    'date' => $dateStr,
                    'formatted_date' => $current->format('d.m'),
                    'orders_count' => $dayData ? (int)$dayData->orders_count : 0,
                    'revenue' => $dayData ? (float)$dayData->revenue : 0
                ];
                
                $current->addDay();
            }

            return $result;
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Get monthly statistics for the last 12 months
     */
    private function getMonthlyStats()
    {
        try {
            $startDate = Carbon::now()->subMonths(12)->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();

            $monthlyData = Order::where('status', 'PositiveFinish')
                ->whereNotNull('paid_at')
                ->where('paid_at', '>=', $startDate)
                ->select(
                    DB::raw('YEAR(paid_at) as year'),
                    DB::raw('MONTH(paid_at) as month'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(amount) as revenue')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();

            // Fill missing months with zero values
            $result = [];
            $current = $startDate->copy();
            
            while ($current <= $endDate) {
                $year = $current->year;
                $month = $current->month;
                
                $monthData = $monthlyData->where('year', $year)->where('month', $month)->first();
                
                $result[] = [
                    'year' => $year,
                    'month' => $month,
                    'formatted_date' => $current->format('M Y'),
                    'orders_count' => $monthData ? (int)$monthData->orders_count : 0,
                    'revenue' => $monthData ? (float)$monthData->revenue : 0
                ];
                
                $current->addMonth();
            }

            // Calculate growth for current month vs previous month
            $currentMonth = end($result);
            $previousMonth = count($result) > 1 ? $result[count($result) - 2] : null;
            
            $ordersGrowth = 0;
            $revenueGrowth = 0;
            
            if ($previousMonth && $previousMonth['orders_count'] > 0) {
                $ordersGrowth = (($currentMonth['orders_count'] - $previousMonth['orders_count']) / $previousMonth['orders_count']) * 100;
            } elseif ($currentMonth['orders_count'] > 0) {
                $ordersGrowth = 100;
            }
            
            if ($previousMonth && $previousMonth['revenue'] > 0) {
                $revenueGrowth = (($currentMonth['revenue'] - $previousMonth['revenue']) / $previousMonth['revenue']) * 100;
            } elseif ($currentMonth['revenue'] > 0) {
                $revenueGrowth = 100;
            }

            return [
                'data' => $result,
                'growth' => [
                    'orders' => round($ordersGrowth, 2),
                    'revenue' => round($revenueGrowth, 2)
                ]
            ];
        } catch (\Exception $e) {
            return ['data' => [], 'growth' => ['orders' => 0, 'revenue' => 0]];
        }
    }

    /**
     * Get yearly statistics
     */
    private function getYearlyStats()
    {
        try {
            $startYear = Carbon::now()->subYears(5)->year;
            $currentYear = Carbon::now()->year;

            $yearlyData = Order::where('status', 'PositiveFinish')
                ->whereNotNull('paid_at')
                ->whereYear('paid_at', '>=', $startYear)
                ->select(
                    DB::raw('YEAR(paid_at) as year'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(amount) as revenue')
                )
                ->groupBy('year')
                ->orderBy('year')
                ->get();

            $result = [];
            for ($year = $startYear; $year <= $currentYear; $year++) {
                $yearData = $yearlyData->firstWhere('year', $year);
                
                $result[] = [
                    'year' => $year,
                    'orders_count' => $yearData ? (int)$yearData->orders_count : 0,
                    'revenue' => $yearData ? (float)$yearData->revenue : 0
                ];
            }

            return $result;
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Get overall statistics
     */
    private function getOverallStats()
    {
        try {
            $totalStats = Order::where('status', 'PositiveFinish')
                ->whereNotNull('paid_at')
                ->select(
                    DB::raw('COUNT(*) as total_orders'),
                    DB::raw('SUM(amount) as total_revenue'),
                    DB::raw('AVG(amount) as average_order_value')
                )
                ->first();

            $todayStats = Order::where('status', 'PositiveFinish')
                ->whereNotNull('paid_at')
                ->whereDate('paid_at', Carbon::today())
                ->select(
                    DB::raw('COUNT(*) as today_orders'),
                    DB::raw('SUM(amount) as today_revenue')
                )
                ->first();

            $thisMonthStats = Order::where('status', 'PositiveFinish')
                ->whereNotNull('paid_at')
                ->whereYear('paid_at', Carbon::now()->year)
                ->whereMonth('paid_at', Carbon::now()->month)
                ->select(
                    DB::raw('COUNT(*) as month_orders'),
                    DB::raw('SUM(amount) as month_revenue')
                )
                ->first();

            return [
                'total_orders' => (int)($totalStats->total_orders ?? 0),
                'total_revenue' => (float)($totalStats->total_revenue ?? 0),
                'average_order_value' => (float)($totalStats->average_order_value ?? 0),
                'today_orders' => (int)($todayStats->today_orders ?? 0),
                'today_revenue' => (float)($todayStats->today_revenue ?? 0),
                'month_orders' => (int)($thisMonthStats->month_orders ?? 0),
                'month_revenue' => (float)($thisMonthStats->month_revenue ?? 0),
            ];
        } catch (\Exception $e) {
            return [
                'total_orders' => 0,
                'total_revenue' => 0,
                'average_order_value' => 0,
                'today_orders' => 0,
                'today_revenue' => 0,
                'month_orders' => 0,
                'month_revenue' => 0,
            ];
        }
    }

    /**
     * Get analytics data as API
     */
    public function apiData(Request $request)
    {
        $period = $request->query('period', 'daily');

        switch ($period) {
            case 'daily':
                return response()->json($this->getDailyStats());
            case 'monthly':
                return response()->json($this->getMonthlyStats());
            case 'yearly':
                return response()->json($this->getYearlyStats());
            default:
                return response()->json($this->getOverallStats());
        }
    }
}
