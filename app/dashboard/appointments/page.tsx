"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CalendarClock,
  CalendarPlus,
  Clock,
  MapPin,
  Stethoscope,
  Video,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/components/providers/session-provider";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, type Tone } from "@/components/dashboard/status-badge";
import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { appointments as seed, DEPARTMENTS, DOCTORS, formatDate } from "@/lib/data";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { validators } from "@/lib/validation";

const TIME_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "01:00 PM", "01:30 PM", "02:00 PM",
  "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
  "04:30 PM", "05:00 PM",
];

const statusTone: Record<AppointmentStatus, Tone> = {
  upcoming:  "info",
  completed: "success",
  cancelled: "danger",
};

export default function AppointmentsPage() {
  const [list, setList] = useState<Appointment[]>(seed);
  const [open, setOpen] = useState(false);

  const grouped = useMemo(
    () => ({
      upcoming:  list.filter((a) => a.status === "upcoming"),
      completed: list.filter((a) => a.status === "completed"),
      cancelled: list.filter((a) => a.status === "cancelled"),
    }),
    [list],
  );

  function cancelAppointment(id: string) {
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)));
    toast.success("Appointment cancelled.");
  }

  function addAppointment(appt: Appointment) {
    setList((prev) => [appt, ...prev]);
    setOpen(false);
    toast.success("Appointment booked!", {
      description: `${appt.doctor} &middot; ${formatDate(appt.date)} at ${appt.time}`,
    });
  }

  return (
    <div>
      <PageHeader title="Appointments" description="Book new visits and manage your schedule.">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <CalendarPlus className="size-4" aria-hidden="true" />
                Book appointment
              </Button>
            }
          />
          <BookingDialog onBook={addAppointment} appointments={list} />
        </Dialog>
      </PageHeader>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="w-full sm:w-auto" aria-label="Appointment views">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({grouped.upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Past ({grouped.completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({grouped.cancelled.length})</TabsTrigger>
        </TabsList>

        {(["upcoming", "completed", "cancelled"] as const).map((key) => (
          <TabsContent key={key} value={key} className="mt-4">
            {grouped[key].length === 0 ? (
              <EmptyAppointments />
            ) : (
              <ul className="grid gap-3" aria-label={`${key} appointments, ${grouped[key].length} item${grouped[key].length !== 1 ? 's' : ''}`}>
                {grouped[key].map((a) => (
                  <li key={a.id}>
                    <AppointmentCard appt={a} onCancel={cancelAppointment} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}

        <TabsContent value="calendar" className="mt-4">
          <CalendarView appointments={list} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Appointment card ─────────────────────────────────────────── */

function AppointmentCard({
  appt,
  onCancel,
}: {
  appt: Appointment;
  onCancel: (id: string) => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Stethoscope className="size-5" />
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{appt.doctor}</p>
              <StatusBadge tone={statusTone[appt.status]}>
                {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
              </StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground">
              {appt.id} &middot; {appt.specialty} &middot; {appt.department}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarClock className="size-4" aria-hidden="true" />
                {formatDate(appt.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {appt.time}
              </span>
              <span className="flex items-center gap-1.5">
                {appt.mode === "Video" ? (
                  <Video className="size-4" aria-hidden="true" />
                ) : (
                  <MapPin className="size-4" aria-hidden="true" />
                )}
                {appt.mode}
              </span>
            </div>
            <p className="text-sm text-pretty">
              <span className="text-muted-foreground">Reason: </span>
              {appt.reason}
            </p>
          </div>
        </div>

        {appt.status === "upcoming" && (
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm" className="self-start md:self-center">
                  <X className="size-4" aria-hidden="true" />
                  Cancel
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel this appointment?</DialogTitle>
                <DialogDescription>
                  You&apos;re about to cancel your {appt.specialty} appointment with {appt.doctor} on{" "}
                  {formatDate(appt.date)}. This action can&apos;t be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline">Keep appointment</Button>} />
                <DialogClose
                  render={
                    <Button variant="destructive" onClick={() => onCancel(appt.id)}>
                      Yes, cancel
                    </Button>
                  }
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Empty state ──────────────────────────────────────────────── */

function EmptyAppointments() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted" aria-hidden="true">
          <CalendarClock className="size-6 text-muted-foreground" />
        </span>
        <div>
          <p className="font-medium">No appointments here</p>
          <p className="text-sm text-muted-foreground">
            When you have appointments in this category, they&apos;ll appear here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Booking dialog ───────────────────────────────────────────── */

type BookingErrors = Partial<Record<"department" | "doctor" | "date" | "time" | "reason" | "patientName", string>>;

const DEPT_OPTIONS = DEPARTMENTS.map((d) => ({ value: d, label: d }));
const DOCTOR_OPTIONS = DOCTORS.map((d) => ({
  value: d.name,
  label: d.name,
  sublabel: d.specialty,
}));

/** Convert a 12-h slot string like "02:30 PM" to minutes since midnight. */
function slotToMinutes(slot: string): number {
  const [timePart, period] = slot.split(" ");
  const [h, m] = timePart.split(":").map(Number);
  const hours24 = period === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
  return hours24 * 60 + m;
}

/** Return only future slots for today; all slots for future dates, excluding already booked slots. */
function getAvailableSlots(selectedDate: string, appointments: Appointment[]) {
  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const bookedTimes = appointments
    .filter((a) => a.date === selectedDate && a.status !== "cancelled")
    .map((a) => a.time);

  let slots = TIME_SLOTS;

  if (selectedDate === todayStr) {
    const nowMins = today.getHours() * 60 + today.getMinutes() + 30;
    slots = slots.filter((t) => slotToMinutes(t) > nowMins);
  }

  return slots
    .filter((t) => !bookedTimes.includes(t))
    .map((t) => ({
      value: t,
      label: t,
    }));
}

function BookingDialog({ onBook, appointments }: { onBook: (a: Appointment) => void; appointments: Appointment[] }) {
  const { role } = useSession();
  const isAdmin = role === "admin";
  
  const [patientName, setPatientName] = useState("");
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor]         = useState("");
  const [date, setDate]             = useState("");
  const [time, setTime]             = useState("");
  const [mode, setMode]             = useState<"In-person" | "Video">("In-person");
  const [reason, setReason]         = useState("");
  const [errors, setErrors]         = useState<BookingErrors>({});

  const availableTimeOptions = useMemo(() => getAvailableSlots(date, appointments), [date, appointments]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: BookingErrors = {
      patientName: isAdmin && !patientName ? "Please enter a patient name." : undefined,
      department: department ? undefined : "Please choose a department.",
      doctor:     doctor     ? undefined : "Please choose a doctor.",
      date:       validators.required(date, "Date"),
      time:       time       ? undefined : "Please choose a time slot.",
      reason:     reason     ? validators.minLength(reason, 5, "Reason") : undefined,
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please complete the required fields.");
      return;
    }
    const doc = DOCTORS.find((d) => d.name === doctor);
    onBook({
      id:        `APT-${Math.floor(5100 + reason.length * 7 + time.length)}`,
      doctor,
      specialty: doc?.specialty ?? "General Medicine",
      department,
      date,
      time,
      mode,
      status: "upcoming",
      reason,
      patientName: isAdmin ? patientName : undefined,
    });
  }

  function clearError(field: keyof BookingErrors) {
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="pb-2">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <CalendarPlus className="size-5 text-primary" />
          </span>
          <div>
            <DialogTitle className="text-lg">Book an appointment</DialogTitle>
            <DialogDescription className="mt-0.5">
              Choose a provider, date, and time that works for you.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={submit} noValidate className="space-y-6 pt-2">

        {/* ── Section 0: Patient (Admin only) ── */}
        {isAdmin && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <UserPlus className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Patient Information</h3>
              <div className="flex-1 border-t border-border/60" />
            </div>
            <Field name="patientName" label="Patient Name" error={errors.patientName} required>
              {(p) => (
                <Input
                  {...p}
                  placeholder="E.g., Amara Perez"
                  value={patientName}
                  onChange={(e) => { setPatientName(e.target.value); clearError("patientName"); }}
                />
              )}
            </Field>
          </section>
        )}

        {/* ── Section 1: Provider ── */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Provider</h3>
            <div className="flex-1 border-t border-border/60" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="department" label="Department" error={errors.department} required>
              {(p) => (
                <Combobox
                  id={p.id}
                  aria-invalid={p["aria-invalid"]}
                  aria-describedby={p["aria-describedby"]}
                  options={DEPT_OPTIONS}
                  value={department}
                  onChange={(v) => { setDepartment(v); clearError("department"); }}
                  placeholder="Search department..."
                  searchPlaceholder="Type to search..."
                />
              )}
            </Field>

            <Field name="doctor" label="Doctor" error={errors.doctor} required>
              {(p) => (
                <Combobox
                  id={p.id}
                  aria-invalid={p["aria-invalid"]}
                  aria-describedby={p["aria-describedby"]}
                  options={DOCTOR_OPTIONS}
                  value={doctor}
                  onChange={(v) => { setDoctor(v); clearError("doctor"); }}
                  placeholder="Search doctor..."
                  searchPlaceholder="Type to search..."
                />
              )}
            </Field>
          </div>
        </section>

        {/* ── Section 2: Date & Time ── */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Date &amp; Time</h3>
            <div className="flex-1 border-t border-border/60" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="date" label="Preferred date" error={errors.date} required>
              {(p) => (
                <Input
                  {...p}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime(""); // clear stale time whenever date changes
                    clearError("date");
                  }}
                />
              )}
            </Field>

            <Field name="time" label="Time slot" error={errors.time} required>
              {(p) => (
                <Combobox
                  id={p.id}
                  aria-invalid={p["aria-invalid"]}
                  aria-describedby={p["aria-describedby"]}
                  options={availableTimeOptions}
                  value={time}
                  onChange={(v) => { setTime(v); clearError("time"); }}
                  placeholder={date ? "Select time..." : "Pick a date first"}
                  searchPlaceholder="e.g. 10:00 AM"
                  emptyText={date ? "No available slots for today." : "Select a date first."}
                />
              )}
            </Field>
          </div>
        </section>

        {/* ── Section 3: Appointment type ── */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Video className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Appointment type</h3>
            <div className="flex-1 border-t border-border/60" />
          </div>
          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as "In-person" | "Video")}
            className="grid grid-cols-2 gap-3"
            aria-label="Appointment type"
          >
            {(["In-person", "Video"] as const).map((m) => (
              <Label
                key={m}
                htmlFor={`mode-${m}`}
                className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-all hover:bg-accent/60 has-data-[checked]:border-primary has-data-[checked]:bg-primary/5 has-data-[checked]:shadow-sm"
              >
                <RadioGroupItem id={`mode-${m}`} value={m} />
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  {m === "Video" ? (
                    <Video className="size-4 text-primary" aria-hidden="true" />
                  ) : (
                    <MapPin className="size-4 text-primary" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className="font-semibold">{m}</p>
                  <p className="text-xs text-muted-foreground">
                    {m === "Video" ? "Join via video call" : "Visit in clinic"}
                  </p>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </section>

        {/* ── Section 4: Reason ── */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Stethoscope className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Visit details</h3>
            <div className="flex-1 border-t border-border/60" />
          </div>
          <Field name="reason" label="Reason for visit" error={errors.reason}>
            {(p) => (
              <Textarea
                {...p}
                rows={3}
                placeholder="Briefly describe your symptoms or the reason for this visit..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value.trim().length >= 5) clearError("reason");
                }}
              />
            )}
          </Field>
        </section>

        <DialogFooter className="gap-2 pt-2 border-t border-border/60">
          <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
          <Button type="submit" className="gap-2">
            <CalendarPlus className="size-4" aria-hidden="true" />
            Confirm booking
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

/* ── Calendar View ────────────────────────────────────────────── */

function CalendarView({ appointments }: { appointments: Appointment[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = new Date();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
        
        <div className="hidden md:grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-muted p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="min-h-[100px] bg-background p-2" />
          ))}
          
          {days.map((day) => {
            const dateStr = [
              year,
              String(month + 1).padStart(2, "0"),
              String(day).padStart(2, "0"),
            ].join("-");
            
            const dayAppts = appointments.filter((a) => a.date === dateStr && a.status !== "cancelled");
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            
            return (
              <div key={day} className="flex min-h-[100px] flex-col gap-1 border-t border-transparent bg-background p-2">
                <span className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-sm",
                  isToday ? "bg-primary font-semibold text-primary-foreground" : "font-medium text-muted-foreground"
                )}>
                  {day}
                </span>
                
                <div className="mt-1 flex flex-col gap-1">
                  {dayAppts.map((a) => (
                    <div 
                      key={a.id} 
                      className="truncate rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                      title={`${a.time} - ${a.doctor}`}
                    >
                      {a.time}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile view: list of daily appointments */}
        <div className="md:hidden mt-4 flex flex-col gap-4">
          {days.map((day) => {
            const dateStr = [
              year,
              String(month + 1).padStart(2, "0"),
              String(day).padStart(2, "0"),
            ].join("-");
            
            const dayAppts = appointments.filter((a) => a.date === dateStr && a.status !== "cancelled");
            if (dayAppts.length === 0) return null;
            
            const dateObj = new Date(year, month, day);
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            
            return (
              <div key={`mobile-${day}`} className={cn("flex flex-col gap-2 rounded-xl border p-4 shadow-sm", isToday && "border-primary bg-primary/5")}>
                <p className="font-semibold text-foreground">
                  {dateObj.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                  {isToday && <span className="ml-2 text-xs font-medium text-primary">Today</span>}
                </p>
                <div className="flex flex-col gap-2">
                  {dayAppts.map(a => (
                    <div key={`mobile-${a.id}`} className="flex flex-col gap-1 rounded-lg bg-background p-3 border">
                       <p className="text-sm font-semibold">{a.time}</p>
                       <p className="text-xs text-muted-foreground">{a.doctor} &middot; {a.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {appointments.filter(a => {
            const [y, m] = a.date.split("-").map(Number);
            return y === year && (m - 1) === month && a.status !== "cancelled";
          }).length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No appointments this month.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
