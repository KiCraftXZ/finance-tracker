import Link from "next/link";

// Icons as simple SVG components for minimalist design
const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const WalletIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
  </svg>
);

const TargetIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const features = [
  {
    icon: ChartIcon,
    title: "Expenses Tracking",
    description: "Effortlessly log and categorize every transaction with intuitive controls.",
  },
  {
    icon: WalletIcon,
    title: "Smart Budgets",
    description: "Set monthly budgets and receive gentle reminders when you're close to limits.",
  },
  {
    icon: TargetIcon,
    title: "Financial Goals",
    description: "Define savings targets and track your progress with visual milestones.",
  },
  {
    icon: ShieldIcon,
    title: "Bank-Level Security",
    description: "Your financial data is encrypted and protected with industry-standard security.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    content: "Finally, a finance app that doesn't overwhelm me. Clean, simple, and actually helpful.",
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    content: "I've tried dozens of budgeting apps. Solomon's Finance is the only one I've stuck with.",
  },
  {
    name: "Emily Torres",
    role: "Small Business Owner",
    content: "The simplicity is deceptive—it's incredibly powerful once you start using it.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Solomon&apos;s Finance
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-smooth">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-smooth">
              Testimonials
            </Link>
          </div>
          <Link
            href="#get-started"
            className="rounded-full bg-[var(--accent)] text-[var(--background)] px-5 py-2 text-sm font-medium transition-smooth hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight animate-fade-in opacity-0">
            Financial clarity,
            <br />
            <span className="text-[var(--muted)]">beautifully simple.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto animate-fade-in opacity-0 delay-200">
            Track your spending, set meaningful goals, and take control of your money—all in one elegant app.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in opacity-0 delay-300">
            <Link
              href="#get-started"
              className="rounded-full bg-[var(--accent)] text-[var(--background)] px-8 py-3.5 text-base font-medium transition-smooth hover:opacity-90"
            >
              Start for Free
            </Link>
            <Link
              href="#features"
              className="rounded-full border border-[var(--border)] px-8 py-3.5 text-base font-medium transition-smooth hover:bg-[var(--card)]"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 mx-auto max-w-5xl animate-fade-in-up opacity-0 delay-400">
          <div className="glass-card p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-[var(--muted)]">Total Balance</p>
                <p className="text-3xl md:text-4xl font-semibold mt-1">$24,562.00</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--muted)]">This Month</p>
                <p className="text-lg font-medium text-green-500 mt-1">+$3,240.00</p>
              </div>
            </div>

            {/* Mini chart visualization */}
            <div className="flex items-end gap-2 h-32 border-b border-[var(--border)] pb-4">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 95, 70].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[var(--accent)] rounded-t opacity-20 hover:opacity-40 transition-smooth"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            {/* Recent transactions */}
            <div className="mt-6 space-y-4">
              {[
                { name: "Grocery Store", amount: "-$156.00", date: "Today" },
                { name: "Salary Deposit", amount: "+$4,200.00", date: "Yesterday" },
                { name: "Electric Bill", amount: "-$89.00", date: "Dec 12" },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{tx.name}</p>
                    <p className="text-sm text-[var(--muted)]">{tx.date}</p>
                  </div>
                  <p className={`font-medium ${tx.amount.startsWith('+') ? 'text-green-500' : ''}`}>
                    {tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Everything you need,
              <br />
              <span className="text-[var(--muted)]">nothing you don&apos;t.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass-card p-8 transition-smooth hover:border-[var(--muted)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                  <feature.icon />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-semibold">50K+</p>
              <p className="text-sm text-[var(--muted)] mt-2">Active Users</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-semibold">$2M+</p>
              <p className="text-sm text-[var(--muted)] mt-2">Tracked Daily</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-semibold">4.9</p>
              <p className="text-sm text-[var(--muted)] mt-2">App Store Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Loved by thousands
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              See what our users have to say about their experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="glass-card p-8">
                <p className="text-[var(--muted)] leading-relaxed mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-[var(--muted)]">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-20 px-6 border-t border-[var(--border)]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Ready to take control?
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Join thousands of users who have transformed their relationship with money.
          </p>
          <div className="mt-10">
            <Link
              href="#"
              className="inline-block rounded-full bg-[var(--accent)] text-[var(--background)] px-10 py-4 text-base font-medium transition-smooth hover:opacity-90"
            >
              Get Started — It&apos;s Free
            </Link>
            <p className="mt-4 text-sm text-[var(--muted)]">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Solomon&apos;s Finance</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-smooth">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-smooth">
              Terms
            </Link>
            <Link href="#" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-smooth">
              Contact
            </Link>
          </div>
          <p className="text-sm text-[var(--muted)]">
            © 2024 Solomon&apos;s Finance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
