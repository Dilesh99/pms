import {
  CalendarDays,
  CreditCard,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Pill,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "./types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Short description for tooltips / screen readers */
  description: string;
}

const dashboard: NavItem = {
  title: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
  description: "Overview of your health activity",
};

const appointments: NavItem = {
  title: "Appointments",
  href: "/dashboard/appointments",
  icon: CalendarDays,
  description: "Book and manage appointments",
};

const records: NavItem = {
  title: "Medical Records",
  href: "/dashboard/records",
  icon: FileText,
  description: "View electronic medical records",
};

const prescriptions: NavItem = {
  title: "Prescriptions",
  href: "/dashboard/prescriptions",
  icon: Pill,
  description: "View and refill prescriptions",
};

const labReports: NavItem = {
  title: "Lab Reports",
  href: "/dashboard/lab-reports",
  icon: FlaskConical,
  description: "Access laboratory results",
};

const payments: NavItem = {
  title: "Payments",
  href: "/dashboard/payments",
  icon: CreditCard,
  description: "View invoices and pay online",
};

const profile: NavItem = {
  title: "Profile",
  href: "/dashboard/profile",
  icon: UserCog,
  description: "Manage your account and settings",
};

const navByRole: Record<Role, NavItem[]> = {
  patient: [dashboard, appointments, records, prescriptions, labReports, payments, profile],
  doctor: [
    dashboard,
    { ...appointments, title: "Schedule", description: "Your consultation schedule" },
    records,
    prescriptions,
    labReports,
    profile,
  ],
  admin: [
    dashboard,
    appointments,
    records,
    prescriptions,
    labReports,
    { ...payments, title: "Billing", description: "Billing and revenue" },
    profile,
  ],
};

export function navForRole(role: Role): NavItem[] {
  return navByRole[role];
}
