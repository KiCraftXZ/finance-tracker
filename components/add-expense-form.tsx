"use client"

import * as React from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { db } from "@/lib/db"
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

export function AddExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
    const [amount, setAmount] = React.useState("")
    const [categoryId, setCategoryId] = React.useState<string>("")
    const [date, setDate] = React.useState(format(new Date(), "yyyy-MM-dd"))
    const [note, setNote] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const categories = useLiveQuery(() => db.categories.toArray()) || []

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
                isRecurring: false, // Default for now
            })

            // Reset form
            setAmount("")
            setNote("")
            setDate(format(new Date(), "yyyy-MM-dd"))
            // Keep category? Maybe not.

            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Failed to add expense:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
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
                                placeholder="0.00"
                                className="pl-7 text-lg"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
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
                                    <SelectLabel>Expenses</SelectLabel>
                                    {categories
                                        .filter((c) => c.type === "expense")
                                        .map((category) => (
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
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Income</SelectLabel>
                                    {categories
                                        .filter((c) => c.type === "income")
                                        .map((category) => (
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
                            placeholder="What was this for?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Transaction"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
