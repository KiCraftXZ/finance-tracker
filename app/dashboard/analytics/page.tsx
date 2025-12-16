"use client"

import { useLiveQuery } from "dexie-react-hooks"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar,
    PieChart, Pie, Cell,
    Area, AreaChart
} from "recharts"
import { startOfMonth, subMonths, format, startOfYear, eachMonthOfInterval, endOfMonth, eachDayOfInterval } from "date-fns"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveChartContainer } from "@/components/ui/responsive-chart"
import { chartConfig } from "@/components/ui/chart-config"

export default function AnalyticsPage() {
    const data = useLiveQuery(async () => {
        const expenses = await db.expenses.toArray();
        const categories = await db.categories.toArray();

        // 1. Line Chart: Spending over the last 30 days
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const daysInterval = eachDayOfInterval({ start: thirtyDaysAgo, end: now });
        const dailySpending = daysInterval.map(day => {
            const dateStr = format(day, 'MMM dd');
            const daysExpenses = expenses.filter(e =>
                format(e.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
                categories.find(c => c.id === e.categoryId)?.type === 'expense'
            );
            const total = daysExpenses.reduce((acc, curr) => acc + curr.amount, 0);
            return { date: dateStr, amount: total };
        });


        // 2. Bar Chart: Monthly Spending (Last 6 months)
        const startOf6Months = subMonths(startOfMonth(now), 5);
        const monthsInterval = eachMonthOfInterval({ start: startOf6Months, end: now });

        const monthlySpending = monthsInterval.map(month => {
            const start = startOfMonth(month);
            const end = endOfMonth(month);

            const monthExpenses = expenses.filter(e =>
                e.date >= start && e.date <= end &&
                categories.find(c => c.id === e.categoryId)?.type === 'expense'
            );
            const total = monthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
            return { name: format(month, 'MMM'), total };
        });

        // 3. Pie Chart: Category Distribution (This Month)
        const currentMonthStart = startOfMonth(now);
        const currentMonthSpending = expenses.filter(e =>
            e.date >= currentMonthStart &&
            categories.find(c => c.id === e.categoryId)?.type === 'expense'
        );

        // Group by category
        const categoryMap = new Map<string, number>();
        currentMonthSpending.forEach(e => {
            const cat = categories.find(c => c.id === e.categoryId);
            if (cat) {
                categoryMap.set(cat.name, (categoryMap.get(cat.name) || 0) + e.amount);
            }
        });

        const categoryData = Array.from(categoryMap.entries())
            .map(([name, value]) => {
                const cat = categories.find(c => c.name === name);
                return { name, value, color: cat?.color || '#ccc' };
            })
            .sort((a, b) => b.value - a.value);

        // 4. Insights
        const totalSpentThisMonth = monthlySpending[monthlySpending.length - 1]?.total || 0;
        const totalSpentLastMonth = monthlySpending[monthlySpending.length - 2]?.total || 0;
        const percentChange = totalSpentLastMonth > 0
            ? ((totalSpentThisMonth - totalSpentLastMonth) / totalSpentLastMonth) * 100
            : 0;

        const topCategory = categoryData[0];

        return {
            dailySpending,
            monthlySpending,
            categoryData,
            insights: {
                percentChange,
                topCategory
            }
        };
    });

    if (!data) return <div className="p-8">Loading analytics...</div>;

    const { dailySpending, monthlySpending, categoryData, insights } = data;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-[var(--muted)]">Visualize your financial health.</p>
            </div>

            {/* Insight Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-[var(--muted)]">Spending Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {insights.percentChange > 0 ? '+' : ''}{insights.percentChange.toFixed(1)}%
                        </div>
                        <p className="text-xs text-[var(--muted)]">
                            compared to last month
                        </p>
                        {insights.percentChange > 10 && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg">
                                You're spending significantly more this month. Check your {insights.topCategory?.name} expenses.
                            </div>
                        )}
                        {insights.percentChange < -10 && (
                            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded-lg">
                                Great job! You've cut down your spending significantly.
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-[var(--muted)]">Top Spending Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{insights.topCategory?.name || 'None'}</div>
                        <p className="text-xs text-[var(--muted)]">
                            ${insights.topCategory?.value.toFixed(2)} spent this month
                        </p>
                        {insights.topCategory && (
                            <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--accent)]"
                                    style={{ width: '45%' }} // Placeholder progress, real calc needed against income or budget
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Spending Over Time */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Daily Spending (Last 30 Days)</CardTitle>
                        <CardDescription>Visualizing your daily outflow</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveChartContainer>
                            <AreaChart data={dailySpending}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartConfig.colors.primary} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartConfig.colors.primary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartConfig.theme.gridColor} />
                                <XAxis
                                    dataKey="date"
                                    stroke={chartConfig.theme.textColor}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke={chartConfig.theme.textColor}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke={chartConfig.colors.primary}
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>
                        </ResponsiveChartContainer>
                    </CardContent>
                </Card>

                {/* Monthly Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveChartContainer>
                            <BarChart data={monthlySpending}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartConfig.theme.gridColor} />
                                <XAxis
                                    dataKey="name"
                                    stroke={chartConfig.theme.textColor}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke={chartConfig.theme.textColor}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                    cursor={{ fill: 'var(--accent)', opacity: 0.1 }}
                                />
                                <Bar dataKey="total" fill={chartConfig.colors.primary} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveChartContainer>
                    </CardContent>
                </Card>

                {/* Category Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveChartContainer>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                    formatter={(value: number | undefined) => `$${(value || 0).toFixed(2)}`}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
