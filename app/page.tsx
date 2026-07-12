import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  CalendarCheck,
  CreditCard,
  FileText,
  FlaskConical,
  KeyboardIcon,
  Lock,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import { PublicHeader } from "@/components/marketing/public-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/data";

const services = [
  {
    icon: UserPlus,
    title: "Patient Registration",
    description: "Create your secure profile in minutes with guided, validated forms.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booking",
    description: "Find a specialist, pick a time, and book in-person or video visits.",
  },
  {
    icon: FileText,
    title: "Electronic Medical Records",
    description: "Access your consultations, diagnoses, and vitals anytime, anywhere.",
  },
  {
    icon: Pill,
    title: "Online Prescriptions",
    description: "View active medications, dosages, and request refills with one tap.",
  },
  {
    icon: FlaskConical,
    title: "Laboratory Reports",
    description: "Get lab results with clear reference ranges as soon as they're ready.",
  },
  {
    icon: CreditCard,
    title: "Online Payments",
    description: "Review invoices and settle bills securely from your dashboard.",
  },
];

const securityPoints = [
  {
    icon: Lock,
    title: "Encrypted by design",
    text: "Sensitive medical information is protected in transit and at rest.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    text: "Patients, doctors, and admins see only what they need.",
  },
  {
    icon: Stethoscope,
    title: "Reliable & audited",
    text: "Every record change is traceable, supporting safe clinical care.",
  },
];

const accessPoints = [
  "WCAG-conscious colour contrast",
  "Full keyboard navigation",
  "Visible focus indicators",
  "Screen-reader friendly labels",
  "Alternative text for imagery",
  "Readable typography & spacing",
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--accent),transparent)]"
          />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <Badge variant="secondary" className="gap-1.5">
                <span className="inline-block size-1.5 rounded-full bg-primary" aria-hidden="true" />
                {BRAND.tagline}
              </Badge>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                Your health, connected and{" "}
                <span className="text-primary">always within reach</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
                {BRAND.full} brings appointments, medical records, prescriptions, lab results,
                and payments into one secure, accessible portal — for patients and care teams alike.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" render={<Link href="/register" />}>
                  Register as a patient
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button size="lg" variant="outline" render={<Link href="/login" />}>
                  Log in to portal
                </Button>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
                {[
                  { v: "50k+", l: "Patients served" },
                  { v: "120+", l: "Specialists" },
                  { v: "24/7", l: "Portal access" },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="sr-only">{s.l}</dt>
                    <dd className="text-2xl font-bold text-primary">{s.v}</dd>
                    <p className="text-xs text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </dl>
            </div>

            {/* Decorative summary card */}
            <div className="relative">
              <Card className="mx-auto max-w-md shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Upcoming appointment</CardTitle>
                    <Badge className="gap-1">
                      <CalendarCheck className="size-3" aria-hidden="true" /> Confirmed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
                    <span
                      className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"
                      aria-hidden="true"
                    >
                      <Stethoscope className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium">Dr. Nadia Rahman</p>
                      <p className="text-sm text-muted-foreground">Cardiology · Sat 18 Jul, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-lg border p-3">
                      <Pill className="mx-auto size-4 text-primary" aria-hidden="true" />
                      <p className="mt-1 font-medium">2</p>
                      <p className="text-xs text-muted-foreground">Active meds</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <FlaskConical className="mx-auto size-4 text-primary" aria-hidden="true" />
                      <p className="mt-1 font-medium">2</p>
                      <p className="text-xs text-muted-foreground">New results</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <CreditCard className="mx-auto size-4 text-primary" aria-hidden="true" />
                      <p className="mt-1 font-medium">$225</p>
                      <p className="text-xs text-muted-foreground">Balance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="features" className="scroll-mt-20 border-t bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Everything you need, in one place</h2>
              <p className="mt-3 text-muted-foreground">
                Six core services designed around safety, reliability, and ease of use.
              </p>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <li key={s.title}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader>
                      <span
                        className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                        aria-hidden="true"
                      >
                        <s.icon className="size-5" />
                      </span>
                      <CardTitle className="mt-3">{s.title}</CardTitle>
                      <CardDescription>{s.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="scroll-mt-20 border-t">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="gap-1.5">
                <ShieldCheck className="size-3.5" aria-hidden="true" /> Safety &amp; security
              </Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                Built to protect sensitive medical information
              </h2>
              <p className="mt-3 text-muted-foreground">
                Security and reliability sit at the core of the system. Access is granted by role,
                actions are auditable, and your data stays private.
              </p>
            </div>
            <ul className="grid gap-4">
              {securityPoints.map((p) => (
                <li key={p.title}>
                  <Card>
                    <CardContent className="flex items-start gap-4">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                        aria-hidden="true"
                      >
                        <p.icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-medium">{p.title}</p>
                        <p className="text-sm text-muted-foreground">{p.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Accessibility */}
        <section id="access" className="scroll-mt-20 border-t bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="gap-1.5">
                <Accessibility className="size-3.5" aria-hidden="true" /> Accessibility first
              </Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Designed for everyone</h2>
              <p className="mt-3 text-muted-foreground">
                The interface follows accessibility principles so patients of all abilities can use it
                confidently.
              </p>
            </div>
            <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {accessPoints.map((a) => (
                <li key={a} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                  <KeyboardIcon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="flex flex-col items-center gap-6 py-8 text-center md:flex-row md:justify-between md:text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Ready to take control of your care?</h2>
                  <p className="mt-2 text-primary-foreground/85">
                    Join {BRAND.name} today — registration takes just a few minutes.
                  </p>
                </div>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "shrink-0 gap-2")}
                >
                  Get started
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
