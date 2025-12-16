"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "lucide-react"

export default function SettingsPage() {
    const data = useLiveQuery(async () => {
        const expenses = await db.expenses.toArray();
        const categories = await db.categories.toArray();

        // Calculate Personality
        // 1. Fixed vs Variable (Needs vs Wants)
        // Assumption: 'Food', 'Transport', 'Bills' = Needs. 'Leisure', 'Shopping' = Wants.
        const needsCats = ['Food', 'Transport', 'Bills', 'Rent', 'Utilities', 'Groceries'];
        const wantsCats = ['Leisure', 'Shopping', 'Entertainment', 'Dining Out'];

        // Calculate totals
        let needsTotal = 0;
        let wantsTotal = 0;
        let incomeTotal = 0;
        let expenseTotal = 0;

        expenses.forEach(e => {
            const cat = categories.find(c => c.id === e.categoryId);
            if (!cat) return;

            if (cat.type === 'income') {
                incomeTotal += e.amount;
            } else {
                expenseTotal += e.amount;
                if (needsCats.includes(cat.name)) needsTotal += e.amount;
                else if (wantsCats.includes(cat.name)) wantsTotal += e.amount;
                else wantsTotal += e.amount; // Default to wants if unknown for safety
            }
        });

        const savingsRate = incomeTotal > 0 ? ((incomeTotal - expenseTotal) / incomeTotal) * 100 : 0;

        let personalityType = "Balanced Builder";
        let personalityDesc = "You maintain a healthy balance between enjoying life and saving for the future.";

        if (savingsRate > 40) {
            personalityType = "Super Saver";
            personalityDesc = "You are excellent at delaying gratification. Your future self thanks you!";
        } else if (savingsRate < 10 && savingsRate >= 0) {
            personalityType = "Live-for-Now";
            personalityDesc = "You enjoy your earnings. Consider setting aside a slightly larger buffer.";
        } else if (savingsRate < 0) {
            personalityType = "Deficit Spender";
            personalityDesc = "You are currently spending more than you earn. Time to review the Analytics tab.";
        }

        return {
            personalityType,
            personalityDesc,
            needsTotal,
            wantsTotal,
            expenseCount: expenses.length
        };
    });

    if (!data) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings & Insights</h1>
                <p className="text-[var(--muted)]">Manage your preferences and view behavioral insights.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Behavioral Insight Card */}
                <Card className="md:col-span-2 bg-gradient-to-r from-[var(--card)] to-[var(--accent)]/5 border-[var(--accent)]/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Spending Personality
                            <span className="text-xs bg-[var(--accent)] text-[var(--background)] px-2 py-1 rounded-full">Beta</span>
                        </CardTitle>
                        <CardDescription>Based on your recent transaction history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold mb-2">{data.personalityType}</h3>
                        <p className="text-[var(--muted)] max-w-xl">
                            {data.personalityDesc}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                                <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Needs (Approx)</p>
                                <p className="text-xl font-bold">${data.needsTotal.toFixed(0)}</p>
                            </div>
                            <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                                <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Wants (Approx)</p>
                                <p className="text-xl font-bold">${data.wantsTotal.toFixed(0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Management</CardTitle>
                        <CardDescription>Your data is stored locally on this device.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full" onClick={() => alert("Export feature coming soon (JSON/CSV)")}>
                            Export Data (CSV)
                        </Button>
                        <Button variant="destructive" className="w-full" onClick={async () => {
                            if (confirm("Are you sure? This will wipe all data.")) {
                                await db.expenses.clear();
                                await db.goals.clear();
                                window.location.reload();
                            }
                        }}>
                            Reset All Data
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
