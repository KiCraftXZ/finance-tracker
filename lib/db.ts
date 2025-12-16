import Dexie, { type EntityTable } from 'dexie';

// Define types for our database entities
export type Expense = {
    id: number;
    amount: number;
    categoryId: number; // References Category.id
    date: Date;
    note?: string;
    isRecurring: boolean;
    recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
};

export type CategoryType = 'income' | 'expense';

export type Category = {
    id: number;
    name: string;
    icon: string; // Stored as string identifier for Lucide icon
    color: string; // Hex code or Tailwind class reference
    type: CategoryType;
    budgetLimit?: number;
};

export type SavingsGoal = {
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date;
    icon?: string;
    color?: string;
};

export type Setting = {
    key: string;
    value: any;
};

// Database class
const db = new Dexie('FinanceTrackerDB') as Dexie & {
    expenses: EntityTable<Expense, 'id'>;
    categories: EntityTable<Category, 'id'>;
    goals: EntityTable<SavingsGoal, 'id'>;
    settings: EntityTable<Setting, 'key'>;
};

// Schema declaration
db.version(1).stores({
    expenses: '++id, categoryId, date, isRecurring',
    categories: '++id, name, type',
    goals: '++id, name, deadline',
    settings: 'key'
});

// Seed default categories if empty
db.on('populate', async () => {
    await db.categories.bulkAdd([
        { name: 'Food', icon: 'Utensils', color: '#ef4444', type: 'expense' },
        { name: 'Transport', icon: 'Car', color: '#3b82f6', type: 'expense' },
        { name: 'Leisure', icon: 'Film', color: '#8b5cf6', type: 'expense' },
        { name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', type: 'expense' },
        { name: 'Bills', icon: 'Zap', color: '#f59e0b', type: 'expense' },
        { name: 'Salary', icon: 'Banknote', color: '#22c55e', type: 'income' },
        { name: 'Freelance', icon: 'Laptop', color: '#10b981', type: 'income' }
    ]);
});

export { db };
