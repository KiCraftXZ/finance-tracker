"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { format } from "date-fns"
import { db, type Expense, type Category } from "@/lib/db"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ExpensesPage() {
    const [showAddForm, setShowAddForm] = useState(false)

    // Join expenses with categories manually or via Dexie
    // For simplicity MVP, we fetch both and map.
    const expenses = useLiveQuery(() =>
        db.expenses.orderBy('date').reverse().limit(50).toArray()
    )
    const categories = useLiveQuery(() => db.categories.toArray())

    const getCategory = (id: number) => categories?.find(c => c.id === id)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-[var(--muted)]">Log and view your expenses and income.</p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "secondary" : "default"}>
                    {showAddForm ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Transaction</>}
                </Button>
            </div>

            {showAddForm && (
                <div className="animate-fade-in-up">
                    <AddTransactionForm onSuccess={() => setShowAddForm(false)} />
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {!expenses?.length ? (
                            <div className="text-center py-8 text-[var(--muted)]">
                                No transactions found. Add one to get started!
                            </div>
                        ) : (
                            expenses.map((expense) => {
                                const category = getCategory(expense.categoryId)
                                return (
                                    <div
                                        key={expense.id}
                                        className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                style={{ backgroundColor: category?.color || '#999' }}
                                            >
                                                {/* In real app, render Lucide Icon by name here */}
                                                {category?.name?.[0] || '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium">{category?.name || 'Unknown'}</p>
                                                <p className="text-sm text-[var(--muted)]">
                                                    {format(expense.date, "MMM dd, yyyy")} • {expense.note || ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "font-medium",
                                            category?.type === 'income' ? "text-green-500" : ""
                                        )}>
                                            {category?.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
