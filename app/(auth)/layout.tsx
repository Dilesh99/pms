import Link from "next/link";
import { ArrowLeft, Quote, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { BRAND } from "@/lib/data";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_80%_10%,rgba(255,255,255,0.16),transparent)]"
        />
        <Logo href="/" className="relative text-primary-foreground" labelClassName="text-primary-foreground" />

        <blockquote className="relative max-w-md space-y-4">
          <Quote className="size-8 opacity-70" aria-hidden="true" />
          <p className="text-2xl font-medium leading-relaxed text-balance">
            Managing my appointments, prescriptions, and lab results in one place has made my care so
            much simpler.
          </p>
          <footer className="text-sm text-primary-foreground/80">
            — A CareBridge patient
          </footer>
        </blockquote>

        <div className="relative flex items-center gap-2 text-sm text-primary-foreground/85">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Your data is encrypted and protected.
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between p-4 sm:p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
          <div className="flex items-center gap-3">
            <span className="lg:hidden">
              <Logo href="/" iconOnly />
            </span>
            <ThemeToggle />
          </div>
        </header>

        <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </main>

        <footer className="p-4 text-center text-xs text-muted-foreground sm:p-6">
          © 2026 {BRAND.full} · Demonstration system
        </footer>
      </div>
    </div>
  );
}
