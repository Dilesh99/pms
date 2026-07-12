"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BedDouble,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  FlaskConical,
  Heart,
  Pill,
  Stethoscope,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const { user, role } = useSession();
  if (!user || !role) return null;

  const firstName = user.name.replace(/^Dr\.\s*/, "").split(" ")[0];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={
          role === "admin"
            ? "Here's your practice overview for today."
            : role === "doctor"
            ? "Here's your clinical summary for today."
            : "Here's a snapshot of your health today."
        }
      >
        {role === "patient" && (
          <Button render={<Link href="/dashboard/appointments" />}>
            <CalendarDays className="size-4" aria-hidden="true" />
            Book appointment
          </Button>
        )}
      </PageHeader>

      {role === "patient" && <PatientHome />}
      {role === "doctor"  && <DoctorHome />}
      {role === "admin"   && <AdminHome />}
    </div>
  );
}

/* =============================== PATIENT =============================== */

function PatientHome() {
  const upcoming   = appointments.filter((a) => a.status === "upcoming");
  const activeMeds = prescriptions.filter((p) => p.status === "active");
  const balance    = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming appointments" value={upcoming.length} icon={CalendarClock} hint="Next: 18 Jul" />
        <StatCard label="Active prescriptions"  value={activeMeds.length} icon={Pill} hint="2 refills available" />
        <StatCard label="Lab results ready"     value={labReports.filter((l) => l.status === "ready").length} icon={FlaskConical} hint="Tap to view" />
        <StatCard label="Outstanding balance"   value={currency(balance)} icon={DollarSign} hint="Due this month" accent="text-amber-600 dark:text-amber-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Upcoming appointments</CardTitle>
              <CardDescription>Your scheduled visits with care providers.</CardDescription>
            </div>
            <Link href="/dashboard/appointments" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 text-primary hover:text-primary/80")}>
              View all <ArrowRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((a) => (
              <div key={a.id} className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Stethoscope className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{a.doctor}</p>
                    <p className="text-sm text-muted-foreground">{a.specialty} &middot; {formatDate(a.date)}, {a.time}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground italic">{a.reason}</p>
                  </div>
                </div>
                <StatusBadge tone={a.mode === "Video" ? "info" : "neutral"}>{a.mode}</StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/*<Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-4 text-rose-500" /> Health vitals
            </CardTitle>
            <CardDescription>From your last visit - Jun 12.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: "Blood pressure", value: "132/85", unit: "mmHg", progress: 68, note: "Slightly elevated", color: "bg-amber-400" },
              { label: "Heart rate",     value: "72",     unit: "bpm",  progress: 52, note: "Normal",           color: "bg-emerald-500" },
              { label: "BMI",            value: "23.4",   unit: "kg/m2",progress: 46, note: "Healthy",          color: "bg-emerald-400" },
              { label: "SpO2",           value: "98",     unit: "%",    progress: 98, note: "Excellent",        color: "bg-sky-500" },
            ].map((v) => (
              <div key={v.label}>
                <div className="flex items-end justify-between">
                  <p className="text-sm font-medium">{v.label}</p>
                  <p className="text-sm font-bold">{v.value} <span className="text-xs font-normal text-muted-foreground">{v.unit}</span></p>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full transition-all", v.color)} style={{ width: `${v.progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{v.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>*/}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Active medications</CardTitle>
              <CardDescription>Your current prescriptions.</CardDescription>
            </div>
            <Link href="/dashboard/prescriptions" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 text-primary")}>
              View all <ArrowRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeMeds.map((med) => (
              <div key={med.id} className="flex items-center gap-3 rounded-xl border bg-muted/20 p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Pill className="size-4 text-primary" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{med.medication} <span className="font-normal text-muted-foreground text-sm">&middot; {med.dosage}</span></p>
                  <p className="text-xs text-muted-foreground">{med.frequency}</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  {med.refillsLeft} refill{med.refillsLeft !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Lab reports</CardTitle>
              <CardDescription>Your latest test results.</CardDescription>
            </div>
            <Link href="/dashboard/lab-reports" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 text-primary")}>
              View all <ArrowRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {labReports.map((lab) => (
              <div key={lab.id} className="flex items-center gap-3 rounded-xl border bg-muted/20 p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FlaskConical className="size-4 text-primary" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{lab.test}</p>
                  <p className="text-xs text-muted-foreground">{lab.category} &middot; {formatDate(lab.date)}</p>
                </div>
                <StatusBadge tone={lab.status === "ready" ? "success" : lab.status === "in-progress" ? "info" : "neutral"}>
                  {lab.status === "ready" ? "Ready" : lab.status === "in-progress" ? "In progress" : "Pending"}
                </StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/*<Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="size-4 text-primary" /> Quick actions</CardTitle>
          <CardDescription>Jump to a common task.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/dashboard/records",       icon: ClipboardList, label: "Medical records", desc: "View history" },
            { href: "/dashboard/prescriptions", icon: Pill,          label: "Prescriptions",   desc: "Refill meds" },
            { href: "/dashboard/lab-reports",   icon: FlaskConical,  label: "Lab reports",     desc: "View results" },
            { href: "/dashboard/payments",      icon: CreditCard,    label: "Pay bills",        desc: "Manage invoices" },
          ].map((qa) => (
            <Link
              key={qa.href}
              href={qa.href}
              className="flex flex-col items-center gap-2 rounded-xl border bg-muted/20 p-4 text-center transition-all hover:bg-primary/5 hover:border-primary/30 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <qa.icon className="size-5 text-primary" />
              </span>
              <span className="text-sm font-semibold leading-tight">{qa.label}</span>
              <span className="text-xs text-muted-foreground">{qa.desc}</span>
            </Link>
          ))}
        </CardContent>
      </Card> */}
    </div>
  );
}

/* =============================== DOCTOR =============================== */

function DoctorHome() {
  const pendingTasks = [
    { task: "Review CBC results - Amara Perez",   due: "Today",    done: false },
    { task: "Sign discharge note - Raj Malhotra", due: "Today",    done: false },
    { task: "Update care plan - Sofia Alvarez",   due: "Tomorrow", done: false },
    { task: "Respond to referral - Dr. Chen",     due: "Jul 14",   done: true  },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Patients seen this week" value={47}    icon={Users}        hint="This week" />
        <StatCard label="Today consultations"     value={doctorSchedule.length} icon={CalendarClock} hint="Scheduled today" />
        <StatCard label="Prescriptions issued"    value={12}   icon={Pill}         hint="This week" />
        <StatCard label="Avg. rating"              value="4.9"  icon={Activity}    hint="From 218 reviews" accent="text-amber-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="size-4 text-primary" /> Today schedule
            </CardTitle>
            <CardDescription>Your consultations for Saturday, 12 July 2026.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {doctorSchedule.map((s, i) => (
              <div key={s.time} className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4">
                <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-center">
                  <span className="text-[10px] font-semibold text-primary leading-none">{s.time.split(" ")[0]}</span>
                  <span className="text-[9px] text-muted-foreground">{s.time.split(" ")[1]}</span>
                </div>
                <Separator orientation="vertical" className="h-9" />
                <div className="flex-1">
                  <p className="font-semibold">{s.patient}</p>
                  <p className="text-sm text-muted-foreground">{s.reason}</p>
                </div>
                <StatusBadge tone={i === 0 ? "success" : "neutral"}>
                  {i === 0 ? "Current" : "Room " + s.room}
                </StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="size-4 text-primary" /> Pending tasks
            </CardTitle>
            <CardDescription>Items needing your attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.map((t) => (
              <div key={t.task} className={cn("flex items-start gap-3 rounded-xl border p-3", t.done && "opacity-60")}>
                <CheckCircle2 className={cn("mt-0.5 size-4 shrink-0", t.done ? "text-primary" : "text-muted-foreground/40")} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium leading-snug", t.done && "line-through text-muted-foreground")}>{t.task}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" /> {t.due}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2"><FlaskConical className="size-4 text-primary" /> Pending lab reviews</CardTitle>
            <CardDescription>Results awaiting your sign-off.</CardDescription>
          </div>
          <Link href="/dashboard/lab-reports" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 text-primary")}>
            View all <ArrowRight className="size-4" />
          </Link>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {labReports.filter((l) => l.status !== "ready").map((lab) => (
            <div key={lab.id} className="flex items-center gap-3 rounded-xl border bg-muted/20 p-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FlaskConical className="size-4 text-primary" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{lab.test}</p>
                <p className="text-xs text-muted-foreground">{lab.orderedBy}</p>
              </div>
              <StatusBadge tone={lab.status === "in-progress" ? "info" : "neutral"}>
                {lab.status === "in-progress" ? "Running" : "Pending"}
              </StatusBadge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* =============================== ADMIN =============================== */

function AdminHome() {
  const revenueData = {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue",
        data: [980000, 1050000, 1120000, 1180000, 1240000, adminStats.revenueMonth],
        borderColor: "#059669",
        backgroundColor: "rgba(16,185,129,0.12)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#059669",
      },
    ],
  };

  const appointmentsData = {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Appointments",
        data: [290, 310, 318, 330, 328, adminStats.appointmentsToday],
        backgroundColor: ["#34d399","#34d399","#34d399","#34d399","#34d399","#10b981"],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const deptOccupancy = [
    { name: "Cardiology",       value: 82, color: "#059669" },
    { name: "General Medicine", value: 64, color: "#10b981" },
    { name: "Pediatrics",       value: 71, color: "#34d399" },
    { name: "Orthopedics",      value: 55, color: "#a7f3d0" },
    { name: "Emergency",        value: 93, color: "#fb923c" },
  ];

  const doughnutData = {
    labels: deptOccupancy.map((d) => d.name),
    datasets: [
      {
        data: deptOccupancy.map((d) => d.value),
        backgroundColor: deptOccupancy.map((d) => d.color),
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 6,
      },
    ],
  };

  const staffData = {
    labels: ["Cardiology", "General Med", "Pediatrics", "Ortho", "Emergency", "Radiology"],
    datasets: [
      {
        label: "Doctors",
        data: [18, 24, 15, 12, 20, 10],
        backgroundColor: "#059669",
        borderRadius: 4,
      },
      {
        label: "Nurses",
        data: [32, 45, 28, 22, 40, 18],
        backgroundColor: "#6ee7b7",
        borderRadius: 4,
      },
    ],
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 } } },
    },
  } as const;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total patients"     value={adminStats.totalPatients.toLocaleString()} icon={Users}        hint="+124 this month" />
        <StatCard label="Appointments today" value={adminStats.appointmentsToday}              icon={CalendarClock} hint="Across all departments" />
        <StatCard label="Active staff"        value={adminStats.activeStaff}                   icon={Stethoscope}  hint="On duty now" />
        <StatCard label="Monthly revenue"     value={currency(adminStats.revenueMonth)}        icon={DollarSign}   hint="July 2026" />
        <StatCard label="Pending lab orders"  value={adminStats.pendingLabs}                   icon={FlaskConical} hint="Awaiting processing" accent="text-amber-600 dark:text-amber-400" />
        <StatCard label="Bed occupancy"       value={`${adminStats.bedOccupancy}%`}           icon={BedDouble}    hint="Hospital-wide" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="size-4 text-primary" /> Monthly revenue</CardTitle>
            <CardDescription>Revenue trend over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <Line
                data={revenueData}
                options={{
                  ...baseOptions,
                  scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                    y: {
                      grid: { color: "#f3f4f6" },
                      ticks: {
                        font: { size: 11 },
                        callback: (v: string | number) => `$${(Number(v) / 1000).toFixed(0)}k`,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="size-4 text-primary" /> Daily appointments</CardTitle>
            <CardDescription>Number of appointments per month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <Bar data={appointmentsData} options={baseOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department occupancy</CardTitle>
            <CardDescription>Current bed occupancy by department.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="h-52 w-52 shrink-0">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` } },
                  },
                  cutout: "62%",
                }}
              />
            </div>
            <ul className="flex-1 space-y-2.5 w-full">
              {deptOccupancy.map((d) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="flex-1 text-sm font-medium">{d.name}</span>
                  <span className="text-sm text-muted-foreground">{d.value}%</span>
                  <div className="w-20 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="size-4 text-primary" /> Staff by department</CardTitle>
            <CardDescription>Doctors vs nurses per department.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm inline-block" style={{ backgroundColor: "#059669" }} /> Doctors</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm inline-block" style={{ backgroundColor: "#6ee7b7" }} /> Nurses</span>
            </div>
            <div className="h-52">
              <Bar
                data={staffData}
                options={{
                  ...baseOptions,
                  scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                    y: { grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 }, stepSize: 10 } },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="size-4 text-primary" /> Recent system activity</CardTitle>
          <CardDescription>Latest events across the practice.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users,        color: "bg-primary/10 text-primary",     label: "New patient registered",   detail: "ID: P-2481 - 2m ago" },
            { icon: CalendarDays, color: "bg-sky-100 text-sky-600",         label: "Appointment confirmed",    detail: "Dr. Rahman - 8m ago" },
            { icon: FlaskConical, color: "bg-amber-100 text-amber-600",     label: "Lab order processed",      detail: "LAB-6955 - 14m ago" },
            { icon: DollarSign,   color: "bg-emerald-100 text-emerald-600", label: "Payment received",         detail: "$180.00 - 22m ago" },
            { icon: Pill,         color: "bg-purple-100 text-purple-600",   label: "Prescription issued",      detail: "RX-9045 - 35m ago" },
            { icon: BedDouble,    color: "bg-rose-100 text-rose-600",       label: "Bed assigned Emergency",   detail: "Bed E-14 - 41m ago" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl border bg-muted/20 p-3">
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", item.color)}>
                <item.icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
