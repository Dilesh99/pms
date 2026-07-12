"use client";

import { useState } from "react";
import { Bell, KeyRound, Mail, Save, ShieldCheck, Smartphone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Field } from "@/components/form/field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/components/providers/session-provider";
import { ROLE_LABELS } from "@/lib/data";
import { validators } from "@/lib/validation";

export default function ProfilePage() {
  const { user, role } = useSession();
  if (!user || !role) return null;

  return (
    <div>
      <PageHeader title="Profile & Settings" description="Manage your personal details, security, and preferences." />

      <div className="mb-6 flex items-center gap-4">
        <Avatar size="lg" className="size-16">
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
            {user.avatarInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">
            {ROLE_LABELS[role]} · {user.subtitle}
          </p>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="flex w-full flex-wrap sm:w-auto">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <PersonalSection email={user.email} name={user.name} />
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <SecuritySection />
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <NotificationsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PersonalSection({ name, email }: { name: string; email: string }) {
  const [fullName, setFullName] = useState(name);
  const [emailValue, setEmailValue] = useState(email);
  const [phone, setPhone] = useState("+1 (555) 000-1234");
  const [address, setAddress] = useState("12 Riverside Way, Springfield, 24601");
  const [allergies, setAllergies] = useState("Penicillin (mild rash)");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; phone?: string }>({});

  function save(e: React.FormEvent) {
    e.preventDefault();
    const next = {
      fullName: validators.minLength(fullName, 2, "Full name"),
      email: validators.email(emailValue),
      phone: validators.phone(phone),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    toast.success("Profile updated successfully.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>Keep your contact and medical details up to date.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="fullName" label="Full name" error={errors.fullName} required>
              {(p) => (
                <Input {...p} autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              )}
            </Field>
            <Field name="email" label="Email address" error={errors.email} required>
              {(p) => (
                <Input
                  {...p}
                  type="email"
                  autoComplete="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                />
              )}
            </Field>
            <Field name="phone" label="Phone number" error={errors.phone} required>
              {(p) => (
                <Input {...p} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              )}
            </Field>
            <Field name="bloodType" label="Blood type">
              {(p) => <Input {...p} defaultValue="O+" placeholder="e.g. O+" />}
            </Field>
          </div>
          <Field name="address" label="Home address">
            {(p) => (
              <Input {...p} autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} />
            )}
          </Field>
          <Field name="allergies" label="Known allergies" hint="List any allergies so your care team is aware.">
            {(p) => (
              <Textarea {...p} rows={2} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            )}
          </Field>
          <div className="flex justify-end">
            <Button type="submit">
              <Save className="size-4" aria-hidden="true" />
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SecuritySection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});

  function save(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = {
      current: current ? undefined : "Enter your current password.",
      next: validators.password(next),
      confirm: confirm === next ? undefined : "Passwords do not match.",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      toast.error("Please review the highlighted fields.");
      return;
    }
    toast.success("Password changed successfully.");
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Use a strong, unique password to protect your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} noValidate className="space-y-4">
            <Field name="current" label="Current password" error={errors.current} required>
              {(p) => (
                <Input
                  {...p}
                  type="password"
                  autoComplete="current-password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                />
              )}
            </Field>
            <Field
              name="next"
              label="New password"
              error={errors.next}
              hint="At least 8 characters, with a letter and a number."
              required
            >
              {(p) => (
                <Input
                  {...p}
                  type="password"
                  autoComplete="new-password"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                />
              )}
            </Field>
            <Field name="confirm" label="Confirm new password" error={errors.confirm} required>
              {(p) => (
                <Input
                  {...p}
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              )}
            </Field>
            <div className="flex justify-end">
              <Button type="submit">
                <KeyRound className="size-4" aria-hidden="true" />
                Update password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">Authenticator app</p>
              <p className="text-sm text-muted-foreground">Enabled — codes required at sign-in.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => toast.info("2FA settings opened (demo).")}>
            Manage 2FA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const prefs = [
  { id: "email-appointments", icon: Mail, label: "Appointment reminders", detail: "By email", checked: true },
  { id: "sms-appointments", icon: Smartphone, label: "Appointment reminders", detail: "By SMS", checked: true },
  { id: "email-results", icon: Bell, label: "New lab results", detail: "Notify when results are ready", checked: true },
  { id: "email-billing", icon: Mail, label: "Billing & payments", detail: "Invoices and receipts", checked: false },
  { id: "email-news", icon: UserRound, label: "Health tips & newsletters", detail: "Occasional updates", checked: false },
];

function NotificationsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification preferences</CardTitle>
        <CardDescription>Choose how you&apos;d like to hear from us.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Notification preferences saved.");
          }}
          className="space-y-2"
        >
          <ul className="divide-y">
            {prefs.map((p) => (
              <li key={p.id}>
                <Label
                  htmlFor={p.id}
                  className="flex cursor-pointer items-center justify-between gap-4 py-3 font-normal"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                      aria-hidden="true"
                    >
                      <p.icon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{p.label}</span>
                      <span className="block text-xs text-muted-foreground">{p.detail}</span>
                    </span>
                  </span>
                  <Checkbox id={p.id} defaultChecked={p.checked} />
                </Label>
              </li>
            ))}
          </ul>
          <div className="flex justify-end pt-2">
            <Button type="submit">
              <Save className="size-4" aria-hidden="true" />
              Save preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
