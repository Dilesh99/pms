import type {
  Appointment,
  Invoice,
  LabReport,
  MedicalRecord,
  Prescription,
  Role,
  User,
} from "./types";

export const BRAND = {
  name: "CareBridge",
  full: "CareBridge Health System",
  tagline: "Compassionate care, connected.",
};

export const DEMO_USERS: Record<Role, User> = {
  patient: {
    id: "P-1024",
    name: "Amara Perez",
    email: "amara.perez@example.com",
    role: "patient",
    avatarInitials: "AP",
    subtitle: "Patient ID: P-1024",
  },
  doctor: {
    id: "D-208",
    name: "Dr. Nadia Rahman",
    email: "n.rahman@carebridge.health",
    role: "doctor",
    avatarInitials: "NR",
    subtitle: "Cardiology · Consultant",
  },
  admin: {
    id: "A-001",
    name: "Priya Menon",
    email: "p.menon@carebridge.health",
    role: "admin",
    avatarInitials: "PM",
    subtitle: "System Administrator",
  },
};

export const ROLE_LABELS: Record<Role, string> = {
  patient: "Patient",
  doctor: "Doctor",
  admin: "Admin",
};

export const appointments: Appointment[] = [
  {
    id: "APT-5001",
    doctor: "Dr. Nadia Rahman",
    specialty: "Cardiology",
    department: "Heart & Vascular Center",
    date: "2026-07-18",
    time: "10:30 AM",
    status: "upcoming",
    mode: "In-person",
    reason: "Routine cardiac follow-up",
  },
  {
    id: "APT-5002",
    doctor: "Dr. Samuel Boyd",
    specialty: "Dermatology",
    department: "Skin Health Clinic",
    date: "2026-07-24",
    time: "02:00 PM",
    status: "upcoming",
    mode: "Video",
    reason: "Review of skin biopsy results",
  },
  {
    id: "APT-4980",
    doctor: "Dr. Elena Cruz",
    specialty: "General Medicine",
    department: "Primary Care",
    date: "2026-06-12",
    time: "09:15 AM",
    status: "completed",
    mode: "In-person",
    reason: "Annual physical examination",
  },
  {
    id: "APT-4975",
    doctor: "Dr. Nadia Rahman",
    specialty: "Cardiology",
    department: "Heart & Vascular Center",
    date: "2026-05-30",
    time: "11:00 AM",
    status: "completed",
    mode: "In-person",
    reason: "ECG and blood pressure review",
  },
  {
    id: "APT-4960",
    doctor: "Dr. Omar Haddad",
    specialty: "Orthopedics",
    department: "Bone & Joint Center",
    date: "2026-05-02",
    time: "03:30 PM",
    status: "cancelled",
    mode: "In-person",
    reason: "Knee pain assessment",
  },
];

export const DEPARTMENTS = [
  "Primary Care",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Ophthalmology",
  "General Surgery",
];

export const DOCTORS = [
  { name: "Dr. Elena Cruz", specialty: "General Medicine" },
  { name: "Dr. Nadia Rahman", specialty: "Cardiology" },
  { name: "Dr. Samuel Boyd", specialty: "Dermatology" },
  { name: "Dr. Omar Haddad", specialty: "Orthopedics" },
  { name: "Dr. Grace Lin", specialty: "Pediatrics" },
  { name: "Dr. Marcus Webb", specialty: "Neurology" },
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: "MR-3301",
    title: "Annual Physical Examination",
    type: "Consultation",
    provider: "Dr. Elena Cruz",
    department: "Primary Care",
    date: "2026-06-12",
    summary: "Overall health good. Blood pressure slightly elevated; lifestyle advice given.",
    details: [
      "Blood pressure: 132/85 mmHg",
      "Weight: 68 kg (stable)",
      "Recommended reduced sodium intake and 30 min daily activity",
      "Follow-up in 3 months",
    ],
  },
  {
    id: "MR-3288",
    title: "Hypertension Diagnosis",
    type: "Diagnosis",
    provider: "Dr. Nadia Rahman",
    department: "Cardiology",
    date: "2026-05-30",
    summary: "Stage 1 hypertension confirmed. Started on low-dose medication.",
    details: [
      "ICD-10: I10 Essential (primary) hypertension",
      "Prescribed Amlodipine 5mg once daily",
      "Home BP monitoring advised",
    ],
  },
  {
    id: "MR-3240",
    title: "Influenza Vaccination",
    type: "Vaccination",
    provider: "Dr. Elena Cruz",
    department: "Primary Care",
    date: "2026-04-03",
    summary: "Seasonal influenza vaccine administered. No adverse reaction.",
    details: ["Vaccine: Quadrivalent influenza", "Site: Left deltoid", "Lot: FLU-2026-118"],
  },
  {
    id: "MR-3198",
    title: "Baseline Vitals",
    type: "Vitals",
    provider: "Dr. Elena Cruz",
    department: "Primary Care",
    date: "2026-04-03",
    summary: "Routine vitals recorded during check-in.",
    details: [
      "Temperature: 36.7 °C",
      "Heart rate: 72 bpm",
      "Respiratory rate: 16 /min",
      "SpO₂: 98%",
    ],
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "RX-9001",
    medication: "Amlodipine",
    dosage: "5 mg",
    frequency: "Once daily (morning)",
    prescribedBy: "Dr. Nadia Rahman",
    dateIssued: "2026-05-30",
    refillsLeft: 2,
    status: "active",
    instructions: "Take with water. Do not stop abruptly. Report swelling or dizziness.",
  },
  {
    id: "RX-8975",
    medication: "Atorvastatin",
    dosage: "10 mg",
    frequency: "Once daily (evening)",
    prescribedBy: "Dr. Nadia Rahman",
    dateIssued: "2026-05-30",
    refillsLeft: 3,
    status: "active",
    instructions: "Take at bedtime. Avoid grapefruit juice.",
  },
  {
    id: "RX-8600",
    medication: "Amoxicillin",
    dosage: "500 mg",
    frequency: "Three times daily",
    prescribedBy: "Dr. Elena Cruz",
    dateIssued: "2026-03-14",
    refillsLeft: 0,
    status: "completed",
    instructions: "Complete the full 7-day course even if symptoms improve.",
  },
  {
    id: "RX-8420",
    medication: "Cetirizine",
    dosage: "10 mg",
    frequency: "As needed",
    prescribedBy: "Dr. Samuel Boyd",
    dateIssued: "2025-12-01",
    refillsLeft: 0,
    status: "expired",
    instructions: "For allergy symptoms. May cause mild drowsiness.",
  },
];

export const labReports: LabReport[] = [
  {
    id: "LAB-7001",
    test: "Complete Blood Count (CBC)",
    category: "Hematology",
    orderedBy: "Dr. Elena Cruz",
    date: "2026-06-12",
    status: "ready",
    results: [
      { name: "Hemoglobin", value: "13.8", unit: "g/dL", range: "12.0–15.5", flag: "normal" },
      { name: "White Blood Cells", value: "10.9", unit: "10³/µL", range: "4.0–11.0", flag: "normal" },
      { name: "Platelets", value: "410", unit: "10³/µL", range: "150–400", flag: "high" },
      { name: "Hematocrit", value: "41", unit: "%", range: "36–46", flag: "normal" },
    ],
  },
  {
    id: "LAB-6980",
    test: "Lipid Panel",
    category: "Chemistry",
    orderedBy: "Dr. Nadia Rahman",
    date: "2026-05-30",
    status: "ready",
    results: [
      { name: "Total Cholesterol", value: "214", unit: "mg/dL", range: "< 200", flag: "high" },
      { name: "LDL", value: "138", unit: "mg/dL", range: "< 130", flag: "high" },
      { name: "HDL", value: "52", unit: "mg/dL", range: "> 40", flag: "normal" },
      { name: "Triglycerides", value: "120", unit: "mg/dL", range: "< 150", flag: "normal" },
    ],
  },
  {
    id: "LAB-6955",
    test: "Thyroid Function (TSH)",
    category: "Endocrinology",
    orderedBy: "Dr. Elena Cruz",
    date: "2026-07-09",
    status: "in-progress",
    results: [],
  },
  {
    id: "LAB-6940",
    test: "Vitamin D, 25-Hydroxy",
    category: "Chemistry",
    orderedBy: "Dr. Elena Cruz",
    date: "2026-07-10",
    status: "pending",
    results: [],
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-2201",
    description: "Cardiology consultation & ECG",
    date: "2026-05-30",
    dueDate: "2026-06-29",
    amount: 180.0,
    status: "due",
  },
  {
    id: "INV-2180",
    description: "Lipid panel — laboratory",
    date: "2026-05-30",
    dueDate: "2026-06-29",
    amount: 45.5,
    status: "due",
  },
  {
    id: "INV-2101",
    description: "Annual physical examination",
    date: "2026-06-12",
    dueDate: "2026-05-12",
    amount: 120.0,
    status: "overdue",
  },
  {
    id: "INV-1990",
    description: "Influenza vaccination",
    date: "2026-04-03",
    dueDate: "2026-04-17",
    amount: 25.0,
    status: "paid",
    method: "Visa •••• 4242",
  },
  {
    id: "INV-1885",
    description: "Dermatology consultation",
    date: "2026-02-20",
    dueDate: "2026-03-06",
    amount: 95.0,
    status: "paid",
    method: "Mastercard •••• 8801",
  },
];

/** Admin-facing aggregate stats (mock). */
export const adminStats = {
  totalPatients: 12480,
  appointmentsToday: 342,
  bedOccupancy: 78,
  revenueMonth: 1284500,
  activeStaff: 486,
  pendingLabs: 57,
};

/** Doctor-facing schedule (mock). */
export const doctorSchedule = [
  { time: "09:00 AM", patient: "Amara Perez", reason: "Cardiac follow-up", room: "C-201" },
  { time: "09:45 AM", patient: "Raj Malhotra", reason: "Chest pain review", room: "C-201" },
  { time: "11:00 AM", patient: "Sofia Alvarez", reason: "Post-op check", room: "C-203" },
  { time: "01:30 PM", patient: "Kwame Mensah", reason: "Hypertension review", room: "C-201" },
];

export function currency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
