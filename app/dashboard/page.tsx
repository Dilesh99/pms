"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BedDouble,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  CreditCard,
  DollarSign,
  FlaskConical,
  Pill,
  Stethoscope,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/components/providers/session-provider";
import {
  adminStats,
  appointments,
  currency,
  doctorSchedule,
  formatDate,
  invoices,
  labReports,
  prescriptions,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user, role } = useSession();
  if (!user || !role) return null;

  const firstName = user.name.replace(/^Dr\.\s*/, "").split(" ")[0];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's an overview of what needs your attention today."
      >
        {role === "patient" && (
          <Button render={<Link href="/dashboard/appointments" />}>
            <CalendarDays className="size-4" aria-hidden="true" />
            Book appointment
          </Button>
        )}
      </PageHeader>

      {role === "patient" && <PatientHome />}
      {role === "doctor" && <DoctorHome />}
      {role === "admin" && <AdminHome />}
    </div>
  );
}

/* ---------------------------- Patient ---------------------------- */

function PatientHome() {
  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const activeMeds = prescriptions.filter((p) => p.status === "active").length;
  const readyLabs = labReports.filter((l) => l.status === "ready").length;
  const balance = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const quickActions = [
    { href: "/dashboard/records", icon: ClipboardList, label: "Medical records" },
    { href: "/dashboard/prescriptions", icon: Pill, label: "Prescriptions" },
    { href: "/dashboard/lab-reports", icon: FlaskConical, label: "Lab reports" },
    { href: "/dashboard/payments", icon: CreditCard, label: "Pay bills" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming appointments" value={upcoming.length} icon={CalendarClock} hint="Next: 18 Jul" />
        <StatCard label="Active prescriptions" value={activeMeds} icon={Pill} hint="2 refills available" />
        <StatCard label="New lab results" value={readyLabs} icon={FlaskConical} hint="Ready to view" />
        <StatCard label="Outstanding balance" value={currency(balance)} icon={DollarSign} hint="Due this month" accent="text-amber-600 dark:text-amber-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming appointments</CardTitle>
              <CardDescription>Your scheduled visits with care providers.</CardDescription>
            </div>
            <Link
              href="/dashboard/appointments"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
            >
              View all <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <Stethoscope className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{a.doctor}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.specialty} · {formatDate(a.date)}, {a.time}
                    </p>
                  </div>
                </div>
                <StatusBadge tone={a.mode === "Video" ? "info" : "neutral"}>{a.mode}</StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump to a common task.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((qa) => (
              <Link
                key={qa.href}
                href={qa.href}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <qa.icon className="size-6 text-primary" aria-hidden="true" />
                {qa.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health summary</CardTitle>
          <CardDescription>A snapshot from your latest visit.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <SummaryMetric label="Blood pressure" value="132/85" unit="mmHg" progress={70} note="Slightly elevated" />
          <SummaryMetric label="Heart rate" value="72" unit="bpm" progress={55} note="Normal range" />
          <SummaryMetric label="BMI" value="23.4" unit="kg/m²" progress={48} note="Healthy" />
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  unit,
  progress,
  note,
}: {
  label: string;
  value: string;
  unit: string;
  progress: number;
  note: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold">
        {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
      </p>
      <Progress value={progress} className="mt-3" aria-label={`${label}: ${note}`} />
      <p className="mt-1.5 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

/* ---------------------------- Doctor ---------------------------- */

function DoctorHome() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's patients" value={doctorSchedule.length} icon={Users} hint="4 consultations" />
        <StatCard label="Pending reports" value={3} icon={FlaskConical} hint="Awaiting review" />
        <StatCard label="Prescriptions issued" value={12} icon={Pill} hint="This week" />
        <StatCard label="Avg. rating" value="4.9" icon={Activity} hint="From 218 reviews" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s schedule</CardTitle>
          <CardDescription>Your consultations for Saturday, 11 July.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {doctorSchedule.map((s) => (
            <div key={s.time} className="flex items-center gap-4 rounded-lg border p-3">
              <div className="w-20 shrink-0 text-sm font-semibold text-primary">{s.time}</div>
              <Separator orientation="vertical" className="h-9" />
              <div className="flex-1">
                <p className="font-medium">{s.patient}</p>
                <p className="text-sm text-muted-foreground">{s.reason}</p>
              </div>
              <StatusBadge tone="neutral">Room {s.room}</StatusBadge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------------------- Admin ---------------------------- */

function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total patients" value={adminStats.totalPatients.toLocaleString()} icon={Users} hint="+124 this month" />
        <StatCard label="Appointments today" value={adminStats.appointmentsToday} icon={CalendarClock} hint="Across all departments" />
        <StatCard label="Active staff" value={adminStats.activeStaff} icon={Stethoscope} hint="On duty" />
        <StatCard label="Monthly revenue" value={currency(adminStats.revenueMonth)} icon={DollarSign} hint="July 2026" />
        <StatCard label="Pending lab orders" value={adminStats.pendingLabs} icon={FlaskConical} hint="Awaiting processing" accent="text-amber-600 dark:text-amber-400" />
        <StatCard label="Bed occupancy" value={`${adminStats.bedOccupancy}%`} icon={BedDouble} hint="Hospital-wide" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department capacity</CardTitle>
          <CardDescription>Current occupancy by department.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Cardiology", value: 82 },
            { name: "General Medicine", value: 64 },
            { name: "Pediatrics", value: 71 },
            { name: "Orthopedics", value: 55 },
            { name: "Emergency", value: 93 },
          ].map((d) => (
            <div key={d.name}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{d.name}</span>
                <span className="text-muted-foreground">{d.value}%</span>
              </div>
              <Progress value={d.value} aria-label={`${d.name} occupancy ${d.value}%`} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
