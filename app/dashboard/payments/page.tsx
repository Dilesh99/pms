"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Lock,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/components/providers/session-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge, type Tone } from "@/components/dashboard/status-badge";
import { Combobox } from "@/components/ui/combobox";
import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, formatDate, invoices as seed, appointments } from "@/lib/data";
import type { Invoice, InvoiceStatus } from "@/lib/types";

const statusTone: Record<InvoiceStatus, Tone> = {
  paid: "success",
  due: "warning",
  overdue: "danger",
};

export default function PaymentsPage() {
  const [list, setList] = useState<Invoice[]>(seed);
  const { role } = useSession();
  const isAdmin = role === "admin";

  const totals = useMemo(() => {
    const due = list.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
    const overdue = list
      .filter((i) => i.status === "overdue")
      .reduce((s, i) => s + i.amount, 0);
    const paid = list.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
    return { due, overdue, paid };
  }, [list]);

  function payInvoice(id: string, method: string) {
    setList((prev) => prev.map((i) => (i.id === id ? { ...i, status: "paid", method } : i)));
    toast.success("Payment successful!", { description: "A receipt has been emailed to you." });
  }

  return (
    <div>
      <PageHeader title="Payments" description="Review your invoices and settle bills securely online.">
        {!isAdmin && <AddPaymentDialog onAdd={(inv) => setList((prev) => [inv, ...prev])} />}
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total outstanding"
          value={currency(totals.due)}
          icon={DollarSign}
          accent="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Overdue"
          value={currency(totals.overdue)}
          icon={AlertTriangle}
          accent="text-red-600 dark:text-red-400"
        />
        <StatCard label="Paid this year" value={currency(totals.paid)} icon={CheckCircle2} accent="text-green-600 dark:text-green-400" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>All charges associated with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block overflow-x-auto">
            <Table aria-label="Invoices and billing table">
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  {!isAdmin && <TableHead>Description</TableHead>}
                  <TableHead>Due date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  {!isAdmin && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>
                    {!isAdmin && (
                      <TableCell className="max-w-52 text-pretty">
                        {inv.description}
                        {inv.method && (
                          <span className="block text-xs text-muted-foreground">Paid via {inv.method}</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(inv.dueDate)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {currency(inv.amount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={statusTone[inv.status]}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </StatusBadge>
                    </TableCell>
                    {!isAdmin && (
                      <TableCell className="text-right">
                        {inv.status === "paid" ? (
                          <span className="text-sm text-muted-foreground">Paid</span>
                        ) : (
                          <PaymentDialog invoice={inv} onPay={payInvoice} />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {list.map((inv) => (
              <div key={`mobile-${inv.id}`} className="flex flex-col gap-3 rounded-xl border p-4 shadow-sm bg-card">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{inv.id}</p>
                    <p className="text-sm text-muted-foreground">Due: {formatDate(inv.dueDate)}</p>
                  </div>
                  <StatusBadge tone={statusTone[inv.status]}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </StatusBadge>
                </div>
                {!isAdmin && (
                  <div>
                    <p className="text-sm">{inv.description}</p>
                    {inv.method && (
                      <span className="block text-xs text-muted-foreground mt-0.5">Paid via {inv.method}</span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between border-t pt-3 mt-1">
                  <p className="font-semibold text-lg">{currency(inv.amount)}</p>
                  {!isAdmin && (
                    inv.status === "paid" ? (
                      <span className="text-sm font-medium text-muted-foreground">Paid</span>
                    ) : (
                      <PaymentDialog invoice={inv} onPay={payInvoice} />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type PayErrors = Partial<Record<"name" | "number" | "expiry" | "cvv", string>>;

function PaymentDialog({
  invoice,
  onPay,
}: {
  invoice: Invoice;
  onPay: (id: string, method: string) => void;
}) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<PayErrors>({});
  const [open, setOpen] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const digits = number.replace(/\s/g, "");
    const next: PayErrors = {
      name: name.trim().length >= 2 ? undefined : "Enter the name on the card.",
      number: /^\d{16}$/.test(digits) ? undefined : "Enter a valid 16-digit card number.",
      expiry: /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ? undefined : "Use MM/YY format.",
      cvv: /^\d{3,4}$/.test(cvv) ? undefined : "Enter a 3–4 digit CVV.",
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please check your card details.");
      return;
    }
    onPay(invoice.id, `Card •••• ${digits.slice(-4)}`);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">Pay now</Button>} />
      <DialogContent>
      <DialogHeader>
        <DialogTitle>Pay invoice {invoice.id}</DialogTitle>
        <DialogDescription>
          {invoice.description} — amount due{" "}
          <span className="font-semibold text-foreground">{currency(invoice.amount)}</span>.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={submit} noValidate className="space-y-4">
        <Field name="name" label="Name on card" error={errors.name} required>
          {(p) => (
            <Input
              {...p}
              autoComplete="cc-name"
              placeholder="Amara Perez"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </Field>
        <Field name="number" label="Card number" error={errors.number} required>
          {(p) => (
            <Input
              {...p}
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              value={number}
              onChange={(e) =>
                setNumber(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 16)
                    .replace(/(\d{4})(?=\d)/g, "$1 "),
                )
              }
            />
          )}
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field name="expiry" label="Expiry (MM/YY)" error={errors.expiry} required>
            {(p) => (
              <Input
                {...p}
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="08/28"
                maxLength={5}
                value={expiry}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                }}
              />
            )}
          </Field>
          <Field name="cvv" label="CVV" error={errors.cvv} required>
            {(p) => (
              <Input
                {...p}
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              />
            )}
          </Field>
        </div>

        <p className="flex items-center gap-2 rounded-lg bg-muted/60 p-2.5 text-xs text-muted-foreground">
          <Lock className="size-4 shrink-0 text-primary" aria-hidden="true" />
          Payments are encrypted and processed securely. This is a demo — no real charge is made.
        </p>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
          <Button type="submit">
            <CreditCard className="size-4" aria-hidden="true" />
            Pay {currency(invoice.amount)}
          </Button>
        </DialogFooter>
      </form>
      </DialogContent>
    </Dialog>
  );
}

function AddPaymentDialog({ onAdd }: { onAdd: (invoice: Invoice) => void }) {
  const [open, setOpen] = useState(false);
  
  const [appointmentId, setAppointmentId] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<PayErrors & { amount?: string; appointment?: string }>({});

  const appointmentOptions = appointments.map((a) => ({
    value: a.id,
    label: `${a.id} - ${a.doctor}`,
    sublabel: `${a.date} at ${a.time}`,
  }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const digits = number.replace(/\s/g, "");
    const amountVal = parseFloat(amount);
    
    const next = {
      appointment: appointmentId ? undefined : "Please select an appointment.",
      amount: !isNaN(amountVal) && amountVal > 0 ? undefined : "Enter a valid amount.",
      name: name.trim().length >= 2 ? undefined : "Enter the name on the card.",
      number: /^\d{16}$/.test(digits) ? undefined : "Enter a valid 16-digit card number.",
      expiry: /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ? undefined : "Use MM/YY format.",
      cvv: /^\d{3,4}$/.test(cvv) ? undefined : "Enter a 3–4 digit CVV.",
    };
    
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please check the payment details.");
      return;
    }
    
    const selectedAppt = appointments.find(a => a.id === appointmentId);
    
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      description: `Payment for appointment ${appointmentId} (${selectedAppt?.specialty})`,
      amount: amountVal,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      status: "paid",
      method: `Card •••• ${digits.slice(-4)}`,
    };
    
    onAdd(newInvoice);
    toast.success("Payment added successfully!", { description: "The invoice has been created and marked as paid." });
    setOpen(false);
    
    // Reset form
    setAppointmentId("");
    setAmount("");
    setName("");
    setNumber("");
    setExpiry("");
    setCvv("");
    setErrors({});
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2"><Plus className="size-4"/>Add Payment</Button>} />
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
          <DialogDescription>
            Select an appointment and enter payment details to create a new settled invoice.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="space-y-4">
          <Field name="appointment" label="Select Appointment" error={errors.appointment} required>
            {() => (
              <Combobox
                options={appointmentOptions}
                value={appointmentId}
                onChange={setAppointmentId}
                placeholder="Search appointments..."
              />
            )}
          </Field>
          
          <Field name="amount" label="Amount (LKR)" error={errors.amount} required>
            {(p) => (
              <Input
                {...p}
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            )}
          </Field>
          
          {/* Card fields */}
          <Field name="name" label="Name on card" error={errors.name} required>
            {(p) => (
              <Input
                {...p}
                autoComplete="cc-name"
                placeholder="Amara Perez"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
          </Field>
          <Field name="number" label="Card number" error={errors.number} required>
            {(p) => (
              <Input
                {...p}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                value={number}
                onChange={(e) =>
                  setNumber(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16)
                      .replace(/(\d{4})(?=\d)/g, "$1 "),
                  )
                }
              />
            )}
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field name="expiry" label="Expiry (MM/YY)" error={errors.expiry} required>
              {(p) => (
                <Input
                  {...p}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="08/28"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                  }}
                />
              )}
            </Field>
            <Field name="cvv" label="CVV" error={errors.cvv} required>
              {(p) => (
                <Input
                  {...p}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              )}
            </Field>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
            <Button type="submit">
              <CreditCard className="size-4 mr-2" aria-hidden="true" />
              Pay {amount ? currency(parseFloat(amount) || 0) : ""}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
