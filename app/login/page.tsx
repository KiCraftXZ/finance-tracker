"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsLoading(true)
        // Simulate a small delay for "processing" feel
        setTimeout(() => {
            localStorage.setItem("finance_user_name", name.trim())
            router.push("/dashboard")
        }, 800)
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 relative">
            <Link href="/" className="absolute top-6 left-6 flex items-center text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>

            <Card className="w-full max-w-sm animate-fade-in-up">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>
                        Enter your name to access your personal finance dashboard.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Solomon"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Continue to Dashboard"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <p className="mt-6 text-xs text-[var(--muted)] text-center max-w-xs">
                Data is stored locally on this device. No account creation required.
            </p>
        </div>
    )
}
