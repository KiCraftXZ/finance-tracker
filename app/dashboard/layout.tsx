'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Wallet,
    PiggyBank,
    BarChart3,
    Settings,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const sidebarItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/dashboard/expenses', icon: Wallet, label: 'Expenses' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/dashboard/goals', icon: PiggyBank, label: 'Goals' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("finance_user_name");
        if (!user) {
            router.push("/login");
        } else {
            setUserName(user);
        }
    }, [router]);

    if (!userName) return null; // Prevent flash of content

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--card)] h-screen sticky top-0">
                <div className="p-6 border-b border-[var(--border)]">
                    <Link href="/" className="text-xl font-semibold tracking-tight">
                        Solomon's Finance
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-[var(--accent)] text-[var(--background)]"
                                        : "text-[var(--muted)] hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Top Bar */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-50">
                <Link href="/" className="text-lg font-semibold">
                    Solomon's Finance
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu className="w-6 h-6" />
                </Button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
                <div className="max-w-5xl mx-auto pb-20 md:pb-0">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] px-4 py-2 z-50 flex justify-between items-center safe-area-pb">
                {sidebarItems.slice(0, 5).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[60px]",
                                isActive
                                    ? "text-[var(--accent)]"
                                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
