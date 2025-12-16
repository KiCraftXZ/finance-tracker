"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function DashboardPage() {
    const data = useLiveQuery(async () => {
        const expenses = await db.expenses.toArray();
        const categories = await db.categories.toArray();
        const goals = await db.goals.toArray(); // Assuming we have goals table populated or empty

        // Calculate Monthly Spending
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        const monthlyTransactions = expenses.filter(e =>
            isWithinInterval(e.date, { start, end })
        );

        const monthlySpending = monthlyTransactions
            .filter(e => {
                const cat = categories.find(c => c.id === e.categoryId);
                return cat?.type === 'expense';
            })
            .reduce((acc, curr) => acc + curr.amount, 0);

        const monthlyIncome = monthlyTransactions
            .filter(e => {
                const cat = categories.find(c => c.id === e.categoryId);
                return cat?.type === 'income';
            })
            .reduce((acc, curr) => acc + curr.amount, 0);

        // Calculate Total Balance (Simple Income - Expense of all time)
        // NOTE: This assumes initial balance is 0 or covered by "Income" entries.
        const allIncome = expenses
            .filter(e => categories.find(c => c.id === e.categoryId)?.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const allExpenses = expenses
            .filter(e => categories.find(c => c.id === e.categoryId)?.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const totalBalance = allIncome - allExpenses;

        const recent = expenses.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
        const recentWithCat = recent.map(e => ({
            ...e,
            category: categories.find(c => c.id === e.categoryId)
        }));

        return {
            monthlySpending,
            monthlyIncome,
            totalBalance,
            recentWithCat,
            goals
        };
    });

    if (!data) return <div className="p-8">Loading dashboard...</div>;

    const { monthlySpending, monthlyIncome, totalBalance, recentWithCat, goals } = data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                    <p className="text-[var(--muted)]">Welcome back, here's what's happening with your finance.</p>
                </div>
                <Link href="/dashboard/expenses">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-[var(--muted)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
                        <p className="text-xs text-[var(--muted)]">net worth</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${monthlySpending.toFixed(2)}</div>
                        <p className="text-xs text-[var(--muted)]">in {format(new Date(), 'MMMM')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${monthlyIncome.toFixed(2)}</div>
                        <p className="text-xs text-[var(--muted)]">in {format(new Date(), 'MMMM')}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentWithCat.length === 0 ? (
                                <div className="text-sm text-[var(--muted)]">No recent activity.</div>
                            ) : (
                                recentWithCat.map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: item.category?.color || '#ccc' }}
                                            />
                                            <div>
                                                <p className="text-sm font-medium leading-none">{item.category?.name || 'Uncategorized'}</p>
                                                <p className="text-sm text-[var(--muted)]">{format(item.date, 'MMM dd')} • {item.note || ''}</p>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${item.category?.type === 'income' ? 'text-green-500' : ''}`}>
                                            {item.category?.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Savings Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-[var(--muted)] text-center py-10">
                            Projections & Goals coming soon.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
