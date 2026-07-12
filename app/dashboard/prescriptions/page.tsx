"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Download, Info, Pill, RefreshCw, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, type Tone } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, prescriptions as seed } from "@/lib/data";
import type { Prescription, PrescriptionStatus } from "@/lib/types";

const statusTone: Record<PrescriptionStatus, Tone> = {
  active: "success",
  completed: "neutral",
  expired: "danger",
};

export default function PrescriptionsPage() {
  const [list, setList] = useState<Prescription[]>(seed);

  const grouped = useMemo(
    () => ({
      active: list.filter((p) => p.status === "active"),
      completed: list.filter((p) => p.status === "completed"),
      expired: list.filter((p) => p.status === "expired"),
    }),
    [list],
  );

  function requestRefill(id: string) {
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, refillsLeft: Math.max(0, p.refillsLeft - 1) } : p)),
    );
    toast.success("Refill requested. Your pharmacy will be notified.");
  }

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description="View your medications, dosages, and request refills online."
      />

      <Tabs defaultValue="active">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="active">Active ({grouped.active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({grouped.completed.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({grouped.expired.length})</TabsTrigger>
        </TabsList>

        {(["active", "completed", "expired"] as const).map((key) => (
          <TabsContent key={key} value={key} className="mt-4">
            {grouped[key].length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  No {key} prescriptions.
                </CardContent>
              </Card>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {grouped[key].map((p) => (
                  <li key={p.id}>
                    <PrescriptionCard rx={p} onRefill={requestRefill} />
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

function PrescriptionCard({ rx, onRefill }: { rx: Prescription; onRefill: (id: string) => void }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <Pill className="size-5" />
            </span>
            <div>
              <CardTitle>
                {rx.medication} {rx.dosage}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{rx.frequency}</p>
            </div>
          </div>
          <StatusBadge tone={statusTone[rx.status]}>
            {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
          </StatusBadge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <UserRound className="size-3.5" aria-hidden="true" /> Prescribed by
            </dt>
            <dd className="font-medium">{rx.prescribedBy}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden="true" /> Issued
            </dt>
            <dd className="font-medium">{formatDate(rx.dateIssued)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Refills left</dt>
            <dd className="font-medium">{rx.refillsLeft}</dd>
          </div>
        </dl>

        <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-2.5 text-xs text-muted-foreground">
          <Info className="size-4 shrink-0 text-primary" aria-hidden="true" />
          {rx.instructions}
        </p>

        <div className="flex gap-2">
          {rx.status === "active" && (
            <Dialog>
              <DialogTrigger
                render={
                  <Button size="sm" disabled={rx.refillsLeft === 0} className="flex-1">
                    <RefreshCw className="size-4" aria-hidden="true" />
                    {rx.refillsLeft === 0 ? "No refills" : "Request refill"}
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request a refill</DialogTitle>
                  <DialogDescription>
                    Request a refill for {rx.medication} {rx.dosage}. You have {rx.refillsLeft} refill(s)
                    remaining. Your pharmacy will be notified.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">Cancel</Button>} />
                  <DialogClose render={<Button onClick={() => onRefill(rx.id)}>Confirm refill</Button>} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success(`Prescription ${rx.id} downloaded (demo).`)}
          >
            <Download className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Download</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
