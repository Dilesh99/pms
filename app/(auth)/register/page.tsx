"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/components/providers/session-provider";
import { passwordStrength, validators } from "@/lib/validation";
import { cn } from "@/lib/utils";

type FormState = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initial: FormState = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const strengthColors = ["bg-muted", "bg-destructive", "bg-orange-500", "bg-amber-500", "bg-green-500"];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useSession();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => passwordStrength(form.password), [form.password]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): Errors {
    return {
      firstName: validators.minLength(form.firstName, 2, "First name"),
      lastName: validators.minLength(form.lastName, 2, "Last name"),
      dob: validators.pastDate(form.dob, "Date of birth"),
      gender: form.gender ? undefined : "Please select an option.",
      email: validators.email(form.email),
      phone: validators.phone(form.phone),
      address: validators.minLength(form.address, 5, "Address"),
      password: validators.password(form.password),
      confirmPassword: !form.confirmPassword
        ? "Please confirm your password."
        : form.confirmPassword !== form.password
          ? "Passwords do not match."
          : undefined,
      terms: form.terms ? undefined : "You must accept the terms to continue.",
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    const firstError = Object.entries(nextErrors).find(([, v]) => v);
    if (firstError) {
      toast.error("Please review the highlighted fields.");
      document.getElementById(firstError[0])?.focus();
      return;
    }
    setSubmitting(true);
    toast.success("Registration successful! Redirecting to your dashboard…");
    login("patient");
    router.push("/dashboard");
  }

  return (
    <Card className="border-none shadow-none ring-0">
      <CardHeader className="px-0 text-center sm:text-left">
        <CardTitle className="text-2xl">Create your patient account</CardTitle>
        <CardDescription>
          Register to book appointments and access your records securely.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Personal information */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">Personal information</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="firstName" label="First name" error={errors.firstName} required>
                {(props) => (
                  <Input
                    {...props}
                    autoComplete="given-name"
                    placeholder="Amara"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                  />
                )}
              </Field>
              <Field name="lastName" label="Last name" error={errors.lastName} required>
                {(props) => (
                  <Input
                    {...props}
                    autoComplete="family-name"
                    placeholder="Perez"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                  />
                )}
              </Field>
              <Field name="dob" label="Date of birth" error={errors.dob} required>
                {(props) => (
                  <Input
                    {...props}
                    type="date"
                    max="2026-07-11"
                    value={form.dob}
                    onChange={(e) => update("dob", e.target.value)}
                  />
                )}
              </Field>
              <Field name="gender" label="Gender" error={errors.gender} required>
                {(props) => (
                  <Select value={form.gender} onValueChange={(v) => update("gender", v as string)}>
                    <SelectTrigger
                      id={props.id}
                      aria-invalid={props["aria-invalid"]}
                      aria-describedby={props["aria-describedby"]}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </Field>
            </div>
          </fieldset>

          {/* Contact details */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">Contact details</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="email" label="Email address" error={errors.email} required>
                {(props) => (
                  <Input
                    {...props}
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                )}
              </Field>
              <Field name="phone" label="Phone number" error={errors.phone} required>
                {(props) => (
                  <Input
                    {...props}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 000-1234"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                )}
              </Field>
            </div>
            <Field
              name="address"
              label="Home address"
              error={errors.address}
              hint="Street, city, and postal code."
              required
            >
              {(props) => (
                <Input
                  {...props}
                  autoComplete="street-address"
                  placeholder="12 Riverside Way, Springfield, 24601"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              )}
            </Field>
          </fieldset>

          {/* Account security */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">Account security</legend>
            <Field
              name="password"
              label="Password"
              error={errors.password}
              hint="At least 8 characters, including a letter and a number."
              required
            >
              {(props) => (
                <div className="relative">
                  <Input
                    {...props}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="pr-10"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </Field>

            {form.password && (
              <div>
                <div className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        i < strength.score ? strengthColors[strength.score] : "bg-muted",
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
                  Password strength: <span className="font-medium">{strength.label}</span>
                </p>
              </div>
            )}

            <Field name="confirmPassword" label="Confirm password" error={errors.confirmPassword} required>
              {(props) => (
                <Input
                  {...props}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                />
              )}
            </Field>
          </fieldset>

          <div className="grid gap-1.5">
            <Label htmlFor="terms" className="items-start font-normal">
              <Checkbox
                id="terms"
                className="mt-0.5"
                checked={form.terms}
                onCheckedChange={(checked) => update("terms", checked === true)}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? "terms-error" : undefined}
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </Label>
            {errors.terms && (
              <p id="terms-error" role="alert" className="text-xs font-medium text-destructive">
                {errors.terms}
              </p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <CheckCircle2 className="size-4" aria-hidden="true" /> Creating account…
              </>
            ) : (
              <>
                <UserPlus className="size-4" aria-hidden="true" /> Create account
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="rounded font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
