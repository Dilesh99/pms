"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge, type Tone } from "@/components/dashboard/status-badge";
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
import { currency, formatDate, invoices as seed } from "@/lib/data";
import type { Invoice, InvoiceStatus } from "@/lib/types";

const statusTone: Record<InvoiceStatus, Tone> = {
  paid: "success",
  due: "warning",
  overdue: "danger",
};

export default function PaymentsPage() {
  const [list, setList] = useState<Invoice[]>(seed);

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
      <PageHeader title="Payments" description="Review your invoices and settle bills securely online." />

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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>
                    <TableCell className="max-w-52 text-pretty">
                      {inv.description}
                      {inv.method && (
                        <span className="block text-xs text-muted-foreground">Paid via {inv.method}</span>
                      )}
                    </TableCell>
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
                    <TableCell className="text-right">
                      {inv.status === "paid" ? (
                        <span className="text-sm text-muted-foreground">Paid</span>
                      ) : (
                        <PaymentDialog invoice={inv} onPay={payInvoice} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
