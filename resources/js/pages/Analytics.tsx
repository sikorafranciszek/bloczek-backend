import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpIcon, ArrowDownIcon, DollarSign, ShoppingCart, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

interface DailyStats {
    date: string;
    formatted_date: string;
    orders_count: number;
    revenue: number;
}

interface MonthlyStats {
    data: {
        year: number;
        month: number;
        formatted_date: string;
        orders_count: number;
        revenue: number;
    }[];
    growth: {
        orders: number;
        revenue: number;
    };
}

interface YearlyStats {
    year: number;
    orders_count: number;
    revenue: number;
}

interface OverallStats {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    today_orders: number;
    today_revenue: number;
    month_orders: number;
    month_revenue: number;
}

interface AnalyticsProps {
    dailyStats: DailyStats[];
    monthlyStats: MonthlyStats;
    yearlyStats: YearlyStats[];
    overallStats: OverallStats;
}

export default function Analytics({ dailyStats, monthlyStats, yearlyStats, overallStats }: AnalyticsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('daily');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN'
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('pl-PL').format(num);
    };

    // Modern chart styling
    const primaryColor = 'rgb(99, 102, 241)';
    const secondaryColor = 'rgb(34, 197, 94)';
    const primaryGradient = 'rgba(99, 102, 241, 0.1)';
    const secondaryGradient = 'rgba(34, 197, 94, 0.1)';

    // Chart data for daily statistics
    const dailyChartData = {
        labels: dailyStats.map(item => item.formatted_date),
        datasets: [
            {
                label: 'Zamówienia',
                data: dailyStats.map(item => item.orders_count),
                borderColor: primaryColor,
                backgroundColor: primaryGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: primaryColor,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                yAxisID: 'y',
            },
            {
                label: 'Przychód (PLN)',
                data: dailyStats.map(item => item.revenue),
                borderColor: secondaryColor,
                backgroundColor: secondaryGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: secondaryColor,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                yAxisID: 'y1',
            },
        ],
    };

    // Chart data for monthly statistics
    const monthlyChartData = {
        labels: monthlyStats.data.map(item => item.formatted_date),
        datasets: [
            {
                label: 'Zamówienia',
                data: monthlyStats.data.map(item => item.orders_count),
                borderColor: primaryColor,
                backgroundColor: primaryGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: primaryColor,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                yAxisID: 'y',
            },
            {
                label: 'Przychód (PLN)',
                data: monthlyStats.data.map(item => item.revenue),
                borderColor: secondaryColor,
                backgroundColor: secondaryGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: secondaryColor,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                yAxisID: 'y1',
            },
        ],
    };

    // Chart data for yearly statistics  
    const yearlyChartData = {
        labels: yearlyStats.map(item => item.year.toString()),
        datasets: [
            {
                label: 'Zamówienia',
                data: yearlyStats.map(item => item.orders_count),
                backgroundColor: primaryColor,
                borderColor: primaryColor,
                borderWidth: 0,
                borderRadius: 8,
                borderSkipped: false,
                yAxisID: 'y',
            },
            {
                label: 'Przychód (PLN)',
                data: yearlyStats.map(item => item.revenue),
                backgroundColor: secondaryColor,
                borderColor: secondaryColor,
                borderWidth: 0,
                borderRadius: 8,
                borderSkipped: false,
                yAxisID: 'y1',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'transparent',
                borderWidth: 0,
                cornerRadius: 8,
                displayColors: true,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: 'rgb(156, 163, 175)',
                },
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Liczba zamówień',
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                    color: 'rgb(107, 114, 128)',
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: 'rgb(156, 163, 175)',
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                title: {
                    display: true,
                    text: 'Przychód (PLN)',
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                    color: 'rgb(107, 114, 128)',
                },
                grid: {
                    drawOnChartArea: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: 'rgb(156, 163, 175)',
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'transparent',
                borderWidth: 0,
                cornerRadius: 8,
                displayColors: true,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: 'rgb(156, 163, 175)',
                },
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Liczba zamówień',
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                    color: 'rgb(107, 114, 128)',
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: 'rgb(156, 163, 175)',
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                title: {
                    display: true,
                    text: 'Przychód (PLN)',
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                    color: 'rgb(107, 114, 128)',
                },
                grid: {
                    drawOnChartArea: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: 'rgb(156, 163, 175)',
                },
            },
        },
    };

    const getCurrentChartData = () => {
        switch (selectedPeriod) {
            case 'monthly':
                return monthlyChartData;
            case 'yearly':
                return yearlyChartData;
            default:
                return dailyChartData;
        }
    };

    const getCurrentChartTitle = () => {
        switch (selectedPeriod) {
            case 'monthly':
                return 'Statystyki miesięczne';
            case 'yearly':
                return 'Statystyki roczne';
            default:
                return 'Statystyki dzienne';
        }
    };

    const getCurrentChartDescription = () => {
        switch (selectedPeriod) {
            case 'monthly':
                return 'Ostatnie 12 miesięcy';
            case 'yearly':
                return 'Ostatnie 5 lat';
            default:
                return 'Ostatnie 30 dni';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Analityka', href: '/analytics' }]}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Analityka sprzedaży</h1>
                        <p className="text-sm text-muted-foreground">
                            Monitoruj wyniki sprzedaży i przychody w czasie rzeczywistym
                        </p>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-3xl" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Łączne zamówienia
                            </CardTitle>
                            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                                <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(overallStats.total_orders)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-blue-600 font-medium">+{overallStats.today_orders}</span> dzisiaj
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-3xl" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Łączny przychód
                            </CardTitle>
                            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
                                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(overallStats.total_revenue)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-green-600 font-medium">+{formatCurrency(overallStats.today_revenue)}</span> dzisiaj
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-3xl" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Średnia wartość
                            </CardTitle>
                            <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(overallStats.average_order_value)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                na zamówienie
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-3xl" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Ten miesiąc
                            </CardTitle>
                            <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg">
                                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overallStats.month_orders}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-orange-600 font-medium">{formatCurrency(overallStats.month_revenue)}</span> przychód
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Growth indicators */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${monthlyStats.growth.orders >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                                    {monthlyStats.growth.orders >= 0 ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    )}
                                </div>
                                Wzrost zamówień
                            </CardTitle>
                            <CardDescription>Porównanie miesiąc do miesiąca</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${monthlyStats.growth.orders >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {monthlyStats.growth.orders > 0 ? '+' : ''}{monthlyStats.growth.orders.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${monthlyStats.growth.revenue >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                                    {monthlyStats.growth.revenue >= 0 ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    )}
                                </div>
                                Wzrost przychodów
                            </CardTitle>
                            <CardDescription>Porównanie miesiąc do miesiąca</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${monthlyStats.growth.revenue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {monthlyStats.growth.revenue > 0 ? '+' : ''}{monthlyStats.growth.revenue.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">{getCurrentChartTitle()}</CardTitle>
                                <CardDescription className="mt-1">
                                    {getCurrentChartDescription()}
                                </CardDescription>
                            </div>
                            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Dzienny</SelectItem>
                                    <SelectItem value="monthly">Miesięczny</SelectItem>
                                    <SelectItem value="yearly">Roczny</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            {selectedPeriod === 'yearly' ? (
                                <Bar data={getCurrentChartData()} options={barChartOptions} />
                            ) : (
                                <Line data={getCurrentChartData()} options={chartOptions} />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
