import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { BRAND } from "@/lib/data";

const columns = [
  {
    heading: "Services",
    links: [
      { label: "Appointments", href: "/login" },
      { label: "Medical Records", href: "/login" },
      { label: "Prescriptions", href: "/login" },
      { label: "Lab Reports", href: "/login" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/#features" },
      { label: "Security & Privacy", href: "/#security" },
      { label: "Accessibility", href: "/#access" },
      { label: "Contact", href: "/#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40" id="contact">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {BRAND.tagline} A secure online portal connecting patients and care teams.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              12 Riverside Way, Springfield, 24601
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" aria-hidden="true" />
              <a href="tel:+15550001234" className="hover:text-foreground hover:underline">
                +1 (555) 000-1234
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" aria-hidden="true" />
              <a href="mailto:care@carebridge.health" className="hover:text-foreground hover:underline">
                care@carebridge.health
              </a>
            </li>
          </ul>
        </div>

        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="text-sm font-semibold">{col.heading}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="rounded text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© 2026 {BRAND.full}. For demonstration purposes only — not for real medical use.</p>
          <p className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-green-500" aria-hidden="true" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
