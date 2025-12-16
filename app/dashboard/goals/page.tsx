"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Target, Wallet } from "lucide-react"
import { useState } from "react"
import { ResponsiveChartContainer } from "@/components/ui/responsive-chart"
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { startOfMonth, endOfMonth, eachMonthOfInterval, addMonths, format } from "date-fns"
import { chartConfig } from "@/components/ui/chart-config"

// Interactive slider simple implementation without Shadcn Slider for now (HTML range)
const Slider = ({ value, onChange, min, max, step }: any) => (
    <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-[var(--accent)]"
    />
)

export default function GoalsPage() {
    const [showAddForm, setShowAddForm] = useState(false)
    const [newGoal, setNewGoal] = useState({ name: '', target: '' })
    const [spendingCutScenario, setSpendingCutScenario] = useState(0) // Percentage cut in expenses

    const data = useLiveQuery(async () => {
        const expenses = await db.expenses.toArray();
        const categories = await db.categories.toArray();
        const goals = await db.goals.toArray();

        // Calculate Average Monthly Income/Expense (based on last 3 months for stability)
        // For MVP, just use "This Month" or simple average of available data
        const now = new Date();
        const currentMonthStart = startOfMonth(now);

        // Simple logic: Take all historical data to average? Or just this month?
        // Let's use "Trailing 30 Days" logic for "Average Month"
        // OR simpler: compare Total Income vs Total Expenses / number of active months.
        // Let's stick to "This Month" for simplicity of the MVP projection logic
        const incomeCats = categories.filter(c => c.type === 'income').map(c => c.id);
        const expenseCats = categories.filter(c => c.type === 'expense').map(c => c.id);

        const monthlyIncome = expenses
            .filter(e => incomeCats.includes(e.categoryId) && e.date >= currentMonthStart)
            .reduce((sum, e) => sum + e.amount, 0);

        const monthlyExpense = expenses
            .filter(e => expenseCats.includes(e.categoryId) && e.date >= currentMonthStart)
            .reduce((sum, e) => sum + e.amount, 0);

        const actualSavings = monthlyIncome - monthlyExpense;

        // Projection Logic
        // Start with current balance (Total Income - Total Expense over all time)
        const totalIncomeAll = expenses
            .filter(e => incomeCats.includes(e.categoryId))
            .reduce((sum, e) => sum + e.amount, 0);
        const totalExpenseAll = expenses
            .filter(e => expenseCats.includes(e.categoryId))
            .reduce((sum, e) => sum + e.amount, 0);
        const currentBalance = totalIncomeAll - totalExpenseAll;

        return {
            goals,
            monthlyIncome,
            monthlyExpense,
            currentBalance
        };
    });

    if (!data) return <div className="p-8">Loading goals...</div>;

    const { goals, monthlyIncome, monthlyExpense, currentBalance } = data;

    // Scenario Calculation
    const adjustedExpense = monthlyExpense * (1 - spendingCutScenario / 100);
    const monthlySavings = monthlyIncome - adjustedExpense;

    // Generate 12-month projection
    const projectionData = eachMonthOfInterval({
        start: new Date(),
        end: addMonths(new Date(), 11)
    }).map((date, i) => {
        return {
            date: format(date, 'MMM'),
            balance: currentBalance + (monthlySavings * (i + 1)), // Linear projection
            base: currentBalance + ((monthlyIncome - monthlyExpense) * (i + 1)) // Baseline
        }
    });

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoal.name || !newGoal.target) return;
        await db.goals.add({
            name: newGoal.name,
            targetAmount: parseFloat(newGoal.target),
            currentAmount: 0 // Manual allocation not implemented yet, assumes part of global savings
        });
        setNewGoal({ name: '', target: '' });
        setShowAddForm(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Savings & Projections</h1>
                    <p className="text-[var(--muted)]">Plan your future financial freedom.</p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="w-4 h-4 mr-2" /> New Goal
                </Button>
            </div>

            {showAddForm && (
                <Card className="max-w-md animate-fade-in-up">
                    <CardHeader>
                        <CardTitle>Create Savings Goal</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleAddGoal}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Goal Name</Label>
                                <Input
                                    value={newGoal.name}
                                    onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                                    placeholder="e.g., Emergency Fund"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Target Amount</Label>
                                <Input
                                    type="number"
                                    value={newGoal.target}
                                    onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                                    placeholder="10000"
                                    required
                                />
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button type="submit" className="w-full">Create Goal</Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Current Goals */}
            <div className="grid gap-4 md:grid-cols-3">
                {goals?.map(goal => (
                    <Card key={goal.id}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{goal.name}</CardTitle>
                            <Target className="h-4 w-4 text-[var(--muted)]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${goal.targetAmount.toLocaleString()}</div>
                            <p className="text-xs text-[var(--muted)] mb-4">Target Amount</p>
                            {/* Simple progress bar based on Current Balance vs Sum of Targets? 
                        For MVP, let's assume all Current Balance applies to first goal or shared.
                        Actually, let's just show a visual progress of global balance vs this goal for fun.
                     */}
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--accent)] transition-all duration-500"
                                    style={{ width: `${Math.min(100, (currentBalance / goal.targetAmount) * 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-[var(--muted)] mt-2 text-right">
                                {Math.floor((currentBalance / goal.targetAmount) * 100)}% Covered
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Projection Engine */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Projected Savings (12 Months)</CardTitle>
                        <CardDescription>Based on your current average monthly surplus of <span className="text-green-500 font-bold">${(monthlyIncome - monthlyExpense).toFixed(0)}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveChartContainer>
                            <AreaChart data={projectionData}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartConfig.colors.primary} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartConfig.colors.primary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartConfig.theme.gridColor} />
                                <XAxis dataKey="date" stroke={chartConfig.theme.textColor} fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke={chartConfig.theme.textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `$${v / 1000}k`} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                                <Area type="monotone" dataKey="balance" stroke={chartConfig.colors.primary} fill="url(#colorBalance)" name="projected" />
                                {spendingCutScenario > 0 && (
                                    <Area type="monotone" dataKey="base" stroke={chartConfig.colors.secondary} strokeDasharray="5 5" fill="none" name="baseline" />
                                )}
                            </AreaChart>
                        </ResponsiveChartContainer>
                    </CardContent>
                </Card>

                {/* What If Scenario Control */}
                <Card>
                    <CardHeader>
                        <CardTitle>What If...</CardTitle>
                        <CardDescription>Simulate changes to your lifestyle</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <Label>Cut Monthly Spending</Label>
                                <span className="text-sm font-bold text-[var(--accent)]">{spendingCutScenario}%</span>
                            </div>
                            <Slider
                                min={0}
                                max={50}
                                step={5}
                                value={spendingCutScenario}
                                onChange={setSpendingCutScenario}
                            />
                            <p className="text-xs text-[var(--muted)] mt-2">
                                Reducing expenses by {spendingCutScenario}% would save you an extra
                                <span className="text-green-500 font-bold"> ${(monthlyExpense * (spendingCutScenario / 100)).toFixed(0)}/mo</span>
                            </p>
                        </div>

                        <div className="pt-4 border-t border-[var(--border)]">
                            <h4 className="font-medium mb-2">Impact in 1 year</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    +${((monthlyExpense * (spendingCutScenario / 100)) * 12).toLocaleString()}
                                </span>
                                <span className="text-sm text-[var(--muted)]">extra saved</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
