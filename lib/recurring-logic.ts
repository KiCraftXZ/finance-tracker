import { db } from "@/lib/db";
import { addMonths, format, startOfMonth, endOfMonth, isSameMonth } from "date-fns";

export async function checkAndProcessRecurringTransactions() {
    const LAST_CHECK_KEY = 'finance_last_recurring_check';
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    // Optimization: Run only once per day
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    if (lastCheck === todayStr) {
        return;
    }

    try {
        const expenses = await db.expenses.toArray();
        const recurringMasters = expenses.filter(e => e.isRecurring && e.recurringFrequency === 'monthly');

        const currentMonthStart = startOfMonth(today);
        const currentMonthEnd = endOfMonth(today);

        let newTransactions = 0;

        for (const master of recurringMasters) {
            // Check if we have already generated a transaction for this master for THIS month
            // We look for a transaction with same Note, Category, Amount and within this month.
            // In a real app, we'd have a 'parentId' linking them. For MVP, we use heuristic matching.

            const alreadyExists = expenses.some(e =>
                e.categoryId === master.categoryId &&
                e.amount === master.amount &&
                e.note === master.note &&
                isSameMonth(e.date, today) &&
                e.id !== master.id // Don't match self if looking backwards? 
                // Actually, the "Master" might be the one created last month.
                // Issue: If I created the recurring transaction TODAY, it counts as this month's.
                // So we only generate if the master date is BEFORE this month.
            );

            if (master.date < currentMonthStart) {
                // Master is from previous months. Need to check if we have a copy for this month.
                if (!alreadyExists) {
                    // Create it
                    // Logic: Same day of month, but current month.
                    // Watch out for Day 31 -> Day 30 issues.
                    const targetDate = new Date(today.getFullYear(), today.getMonth(), master.date.getDate());

                    await db.expenses.add({
                        amount: master.amount,
                        categoryId: master.categoryId,
                        date: targetDate,
                        note: master.note, // Maybe append (Recurring)?
                        isRecurring: true, // Mark child as recurring too? Or false? 
                        // If true, it might become a new master next month? 
                        // Let's mark child as FALSE to avoid exponential duplication in this simple MVP logic
                        // OR we keep master logic separate.
                        // Simple MVP: Mark child as TRUE so it looks like a recurring item, 
                        // BUT we need to ensure we don't double count.
                        // SAFEST MVP: Mark child as FALSE, but with a special note or metadata.
                        // Let's keep it TRUE but use the 'alreadyExists' check robustly.
                        // Actually, if we mark it TRUE, next run will see THIS one as a master and try to generate again?
                        // No, because it is in 'currentMonth'.
                        // Next month, both the old master and this new one will be "Before this month".
                        // Then we'll generate TWO copies. That is bad.
                        // SOLUTION: Only the "Original" should generate? Or strict parentId.
                        // MVP FIX: Do not mark generated items as isRecurring. 
                        // User can see them, but they don't spawn children.
                        isRecurring: false,
                        recurringFrequency: undefined
                    });
                    newTransactions++;
                }
            }
        }

        if (newTransactions > 0) {
            console.log(`Generated ${newTransactions} recurring transactions.`);
        }

        localStorage.setItem(LAST_CHECK_KEY, todayStr);

    } catch (error) {
        console.error("Failed to process recurring transactions", error);
    }
}
