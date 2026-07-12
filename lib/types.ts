export type Role = "patient" | "doctor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
  /** Human-readable role-specific subtitle, e.g. "Cardiology" or "Patient ID: P-1024" */
  subtitle: string;
}

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  department: string;
  date: string; // ISO date
  time: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  mode: "In-person" | "Video";
  reason: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: "Consultation" | "Diagnosis" | "Procedure" | "Vaccination" | "Vitals";
  provider: string;
  department: string;
  date: string;
  summary: string;
  details: string[];
}

export type PrescriptionStatus = "active" | "completed" | "expired";

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  dateIssued: string;
  refillsLeft: number;
  status: PrescriptionStatus;
  instructions: string;
}

export type LabStatus = "ready" | "pending" | "in-progress";

export interface LabResultItem {
  name: string;
  value: string;
  unit: string;
  range: string;
  flag: "normal" | "high" | "low";
}

export interface LabReport {
  id: string;
  test: string;
  category: string;
  orderedBy: string;
  date: string;
  status: LabStatus;
  results: LabResultItem[];
}

export type InvoiceStatus = "paid" | "due" | "overdue";

export interface Invoice {
  id: string;
  description: string;
  date: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  method?: string;
}
