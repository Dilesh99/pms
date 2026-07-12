"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CalendarPlus,
  Clock,
  MapPin,
  Stethoscope,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, type Tone } from "@/components/dashboard/status-badge";
import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { appointments as seed, DEPARTMENTS, DOCTORS, formatDate } from "@/lib/data";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { validators } from "@/lib/validation";

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "11:45 AM", "02:00 PM", "03:30 PM", "04:15 PM"];

const statusTone: Record<AppointmentStatus, Tone> = {
  upcoming: "info",
  completed: "success",
  cancelled: "danger",
};

export default function AppointmentsPage() {
  const [list, setList] = useState<Appointment[]>(seed);
  const [open, setOpen] = useState(false);

  const grouped = useMemo(
    () => ({
      upcoming: list.filter((a) => a.status === "upcoming"),
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
      description: `${appt.doctor} · ${formatDate(appt.date)} at ${appt.time}`,
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
          <BookingDialog onBook={addAppointment} />
        </Dialog>
      </PageHeader>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="upcoming">Upcoming ({grouped.upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Past ({grouped.completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({grouped.cancelled.length})</TabsTrigger>
        </TabsList>

        {(["upcoming", "completed", "cancelled"] as const).map((key) => (
          <TabsContent key={key} value={key} className="mt-4">
            {grouped[key].length === 0 ? (
              <EmptyAppointments />
            ) : (
              <ul className="grid gap-3">
                {grouped[key].map((a) => (
                  <li key={a.id}>
                    <AppointmentCard appt={a} onCancel={cancelAppointment} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

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
        <div className="flex items-start gap-3">
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
              {appt.specialty} · {appt.department}
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
                <DialogClose render={<Button variant="outline">Keep appointment</Button>} />
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

type BookingErrors = Partial<Record<"department" | "doctor" | "date" | "time" | "reason", string>>;

function BookingDialog({ onBook }: { onBook: (a: Appointment) => void }) {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<"In-person" | "Video">("In-person");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<BookingErrors>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: BookingErrors = {
      department: department ? undefined : "Please choose a department.",
      doctor: doctor ? undefined : "Please choose a doctor.",
      date: validators.required(date, "Date"),
      time: time ? undefined : "Please choose a time slot.",
      reason: validators.minLength(reason, 5, "Reason"),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please complete the required fields.");
      return;
    }
    const doc = DOCTORS.find((d) => d.name === doctor);
    onBook({
      id: `APT-${Math.floor(5100 + reason.length * 7 + time.length)}`,
      doctor,
      specialty: doc?.specialty ?? "General Medicine",
      department,
      date,
      time,
      mode,
      status: "upcoming",
      reason,
    });
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Book an appointment</DialogTitle>
        <DialogDescription>Choose a department, provider, and time that works for you.</DialogDescription>
      </DialogHeader>

      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="department" label="Department" error={errors.department} required>
            {(p) => (
              <Select
                value={department}
                onValueChange={(v) => {
                  setDepartment(v as string);
                  setErrors((e) => ({ ...e, department: undefined }));
                }}
              >
                <SelectTrigger id={p.id} aria-invalid={p["aria-invalid"]} aria-describedby={p["aria-describedby"]} className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <Field name="doctor" label="Doctor" error={errors.doctor} required>
            {(p) => (
              <Select
                value={doctor}
                onValueChange={(v) => {
                  setDoctor(v as string);
                  setErrors((e) => ({ ...e, doctor: undefined }));
                }}
              >
                <SelectTrigger id={p.id} aria-invalid={p["aria-invalid"]} aria-describedby={p["aria-describedby"]} className="w-full">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {DOCTORS.map((d) => (
                    <SelectItem key={d.name} value={d.name}>
                      {d.name} — {d.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <Field name="date" label="Preferred date" error={errors.date} required>
            {(p) => (
              <Input
                {...p}
                type="date"
                min="2026-07-12"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setErrors((er) => ({ ...er, date: undefined }));
                }}
              />
            )}
          </Field>

          <Field name="time" label="Time slot" error={errors.time} required>
            {(p) => (
              <Select
                value={time}
                onValueChange={(v) => {
                  setTime(v as string);
                  setErrors((e) => ({ ...e, time: undefined }));
                }}
              >
                <SelectTrigger id={p.id} aria-invalid={p["aria-invalid"]} aria-describedby={p["aria-describedby"]} className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Appointment type</legend>
          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as "In-person" | "Video")}
            className="grid grid-cols-2 gap-2"
            aria-label="Appointment type"
          >
            {(["In-person", "Video"] as const).map((m) => (
              <Label
                key={m}
                htmlFor={`mode-${m}`}
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm font-medium hover:bg-accent/60 has-data-[checked]:border-primary has-data-[checked]:bg-accent/60"
              >
                <RadioGroupItem id={`mode-${m}`} value={m} />
                {m === "Video" ? (
                  <Video className="size-4 text-primary" aria-hidden="true" />
                ) : (
                  <MapPin className="size-4 text-primary" aria-hidden="true" />
                )}
                {m}
              </Label>
            ))}
          </RadioGroup>
        </fieldset>

        <Field name="reason" label="Reason for visit" error={errors.reason} required>
          {(p) => (
            <Textarea
              {...p}
              rows={3}
              placeholder="Briefly describe your symptoms or the reason for this visit"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim().length >= 5) setErrors((er) => ({ ...er, reason: undefined }));
              }}
            />
          )}
        </Field>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
          <Button type="submit">
            <CalendarPlus className="size-4" aria-hidden="true" />
            Confirm booking
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
