"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Repeat } from "lucide-react"

import { cn } from "@/lib/utils"
import { db, type Expense } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export function AddTransactionForm({ onSuccess }: { onSuccess?: () => void }) {
    const [type, setType] = React.useState<'expense' | 'income'>('expense')
    const [amount, setAmount] = React.useState("")
    const [categoryId, setCategoryId] = React.useState<string>("")
    const [date, setDate] = React.useState(format(new Date(), "yyyy-MM-dd"))
    const [note, setNote] = React.useState("")

    // Recurring state
    const [isRecurring, setIsRecurring] = React.useState(false)
    const [recurringFrequency, setRecurringFrequency] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly')

    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const categories = useLiveQuery(() => db.categories.toArray()) || []

    // Filter categories based on selected type
    const availableCategories = categories.filter(c => c.type === type)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || !categoryId || !date) return

        setIsSubmitting(true)
        try {
            await db.expenses.add({
                amount: parseFloat(amount),
                categoryId: parseInt(categoryId),
                date: new Date(date),
                note,
                isRecurring,
                recurringFrequency: isRecurring ? recurringFrequency : undefined
            })

            // Reset form
            setAmount("")
            setNote("")
            setDate(format(new Date(), "yyyy-MM-dd"))
            // Keep category? Maybe not.

            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Failed to add transaction:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-lg mx-auto border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader>
                <div className="flex w-full rounded-lg bg-gray-100 p-1 dark:bg-gray-800 mb-4">
                    <button
                        type="button"
                        onClick={() => { setType('expense'); setCategoryId(''); }}
                        className={cn(
                            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
                            type === 'expense'
                                ? "bg-white text-black shadow dark:bg-gray-950 dark:text-white"
                                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        )}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => { setType('income'); setCategoryId(''); }}
                        className={cn(
                            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
                            type === 'income'
                                ? "bg-white text-black shadow dark:bg-gray-950 dark:text-white"
                                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        )}
                    >
                        Income
                    </button>
                </div>
                <CardTitle>{type === 'expense' ? 'Log Expense' : 'Log Income'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="pl-7 text-lg"
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (parseFloat(val) < 0) return;
                                    setAmount(val);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === '-' || e.key === 'e') {
                                        e.preventDefault();
                                    }
                                }}
                                required
                                autoFocus // Optimizing for speed
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {availableCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                {category.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                    {availableCategories.length === 0 && (
                                        <div className="p-2 text-sm text-[var(--muted)] text-center">
                                            No {type} categories found.
                                        </div>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Input
                            id="note"
                            placeholder={type === 'expense' ? "What was this for?" : "Source (e.g. Salary)"}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="recurring"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                        />
                        <Label htmlFor="recurring" className="flex items-center gap-2 cursor-pointer">
                            <Repeat className="w-3 h-3 text-[var(--muted)]" />
                            Recurring Transaction
                        </Label>
                    </div>

                    {isRecurring && (
                        <div className="space-y-2 animate-fade-in pl-6">
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select value={recurringFrequency} onValueChange={(v: any) => setRecurringFrequency(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
