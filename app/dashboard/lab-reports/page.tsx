"use client";

import { ArrowDown, ArrowUp, Download, FlaskConical, Loader2, Minus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, type Tone } from "@/components/dashboard/status-badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, labReports } from "@/lib/data";
import type { LabReport, LabResultItem, LabStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusTone: Record<LabStatus, Tone> = {
  ready: "success",
  pending: "warning",
  "in-progress": "info",
};

const statusLabel: Record<LabStatus, string> = {
  ready: "Ready",
  pending: "Pending",
  "in-progress": "In progress",
};

const flagMeta: Record<
  LabResultItem["flag"],
  { tone: Tone; icon: typeof ArrowUp; label: string }
> = {
  normal: { tone: "success", icon: Minus, label: "Normal" },
  high: { tone: "danger", icon: ArrowUp, label: "High" },
  low: { tone: "info", icon: ArrowDown, label: "Low" },
};

export default function LabReportsPage() {
  return (
    <div>
      <PageHeader
        title="Lab Reports"
        description="Access your laboratory results with clear reference ranges."
      />

      <ul className="grid gap-4 md:grid-cols-2">
        {labReports.map((report) => (
          <li key={report.id}>
            <LabCard report={report} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LabCard({ report }: { report: LabReport }) {
  const abnormal = report.results.filter((r) => r.flag !== "normal").length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <FlaskConical className="size-5" />
            </span>
            <div>
              <CardTitle>{report.test}</CardTitle>
              <CardDescription>
                {report.category} · Ordered by {report.orderedBy}
              </CardDescription>
            </div>
          </div>
          <StatusBadge tone={statusTone[report.status]}>
            {report.status === "in-progress" && (
              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
            )}
            {statusLabel[report.status]}
          </StatusBadge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {report.status === "ready"
            ? `Collected on ${formatDate(report.date)}`
            : `Expected around ${formatDate(report.date)}`}
        </p>

        {report.status === "ready" ? (
          <div className="flex flex-wrap items-center gap-2">
            {abnormal > 0 ? (
              <StatusBadge tone="warning">
                {abnormal} value{abnormal > 1 ? "s" : ""} outside range
              </StatusBadge>
            ) : (
              <StatusBadge tone="success">All values normal</StatusBadge>
            )}

            <Dialog>
              <DialogTrigger render={<Button size="sm">View results</Button>} />
              <ResultsDialog report={report} />
            </Dialog>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(`Report ${report.id} downloaded (demo).`)}
            >
              <Download className="size-4" aria-hidden="true" />
              PDF
            </Button>
          </div>
        ) : (
          <p className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
            Your results are being processed. We&apos;ll notify you as soon as they&apos;re ready.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ResultsDialog({ report }: { report: LabReport }) {
  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{report.test}</DialogTitle>
        <DialogDescription>
          {report.category} · Collected {formatDate(report.date)} · Ordered by {report.orderedBy}
        </DialogDescription>
      </DialogHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead className="text-right">Result</TableHead>
              <TableHead>Reference range</TableHead>
              <TableHead className="text-right">Flag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.results.map((r) => {
              const meta = flagMeta[r.flag];
              const Icon = meta.icon;
              return (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums font-semibold",
                      r.flag !== "normal" && "text-destructive",
                    )}
                  >
                    {r.value} {r.unit}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{r.range}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge tone={meta.tone} className="ml-auto w-fit">
                      <Icon className="size-3" aria-hidden="true" />
                      {meta.label}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Reference ranges may vary by laboratory. Discuss results with your care provider.
      </p>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => toast.success(`Report ${report.id} downloaded (demo).`)}
        >
          <Download className="size-4" aria-hidden="true" />
          Download PDF
        </Button>
        <DialogClose render={<Button>Close</Button>} />
      </DialogFooter>
    </DialogContent>
  );
}
