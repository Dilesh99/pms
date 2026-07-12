"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  LogIn,
  Shield,
  Stethoscope,
  UserRound,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/components/providers/session-provider";
import { DEMO_USERS, ROLE_LABELS, BRAND } from "@/lib/data";
import { validators } from "@/lib/validation";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const roleOptions: { value: Role; icon: typeof UserRound; label: string; gradient: string }[] = [
  { value: "patient", icon: UserRound, label: "Patient", gradient: "from-emerald-500 to-teal-600" },
  /*{ value: "doctor", icon: Stethoscope, label: "Doctor", gradient: "from-blue-500 to-indigo-600" },*/
  { value: "admin", icon: Shield, label: "Admin", gradient: "from-emerald-500 to-teal-600" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();

  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function fillDemo(r: Role) {
    setRole(r);
    setEmail(DEMO_USERS[r].email);
    setPassword("Demo1234");
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = {
      email: validators.email(email),
      password: password ? undefined : "Password is required.",
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) {
      toast.error("Please fix the errors before continuing.");
      return;
    }
    setSubmitting(true);
    login(role);
    toast.success(`Welcome back! Signed in as ${ROLE_LABELS[role]}.`);
    router.push("/dashboard");
  }

  return (
    <main aria-label="Sign in page">
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-area">
          <div className="login-logo-icon">
            <HeartPulse className="size-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="login-brand">{BRAND.name}</h1>
          <p className="login-tagline">Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="login-form" aria-label="Login form">
          {/* Role selector */}
          <fieldset className="login-roles" aria-label="Select your role">
            <legend className="login-roles-legend">Sign in as</legend>
            <div className="login-roles-grid">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const active = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={cn("login-role-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white", active && "login-role-btn--active")}
                    aria-pressed={active}
                    aria-label={`Sign in as ${opt.label}`}
                  >
                    <span
                      className={cn(
                        "login-role-icon-wrap",
                        active ? `bg-gradient-to-br ${opt.gradient}` : "bg-slate-100",
                      )}
                    >
                      <Icon
                        className={cn("size-4", active ? "text-white" : "text-slate-400")}
                        aria-hidden="true"
                      />
                    </span>
                    <span className={cn("login-role-label", active && "login-role-label--active")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Demo autofill hint 
          <p className="login-demo-hint">
            Try demo:{" "}
            {roleOptions.map((opt, i) => (
              <span key={opt.value}>
                <button
                  type="button"
                  onClick={() => fillDemo(opt.value)}
                  className="login-demo-link"
                >
                  {opt.label}
                </button>
                {i < roleOptions.length - 1 && (
                  <span className="text-slate-400"> · </span>
                )}
              </span>
            ))}
          </p>*/}

          {/* Email */}
          <div className="login-field">
            <Label htmlFor="login-email" className="login-label">
              Email address
            </Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className={cn(
                "login-input",
                errors.email && "border-red-400 focus-visible:ring-red-200",
              )}
            />
            {errors.email && (
              <p id="login-email-error" role="alert" className="login-field-error">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="login-field">
            <Label htmlFor="login-password" className="login-label">
              Password
            </Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                className={cn(
                  "login-input pr-11",
                  errors.password && "border-red-400 focus-visible:ring-red-200",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="login-pw-toggle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-md"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" role="alert" className="login-field-error">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember me + Forgot password */}
          <div className="login-remember-row">
            <Label htmlFor="login-remember" className="login-remember-label">
              <Checkbox
                id="login-remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(!!v)}
                className="login-remember-checkbox"
              />
              Remember me
            </Label>
            <Link href="/login" className="login-forgot-link">
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            id="login-submit"
            type="submit"
            size="lg"
            disabled={submitting}
            className="login-submit-btn"
          >
            <LogIn className="size-4" aria-hidden="true" />
            {submitting ? "Signing in…" : "Login"}
          </Button>
        </form>

        {/* Register link */}
        <p className="login-register-text">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="login-register-link">
            Register now
          </Link>
        </p>
      </div>
    </div>
    </main>
  );
}
