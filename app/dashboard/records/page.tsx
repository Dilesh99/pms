"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Download,
  Eye,
  FileText,
  Search,
  Stethoscope,
  Syringe,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, type Tone } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, medicalRecords } from "@/lib/data";
import type { MedicalRecord } from "@/lib/types";

const typeMeta: Record<MedicalRecord["type"], { tone: Tone; icon: typeof FileText }> = {
  Consultation: { tone: "info", icon: Stethoscope },
  Diagnosis: { tone: "warning", icon: Activity },
  Procedure: { tone: "neutral", icon: FileText },
  Vaccination: { tone: "success", icon: Syringe },
  Vitals: { tone: "neutral", icon: Activity },
};

const TYPES = ["all", "Consultation", "Diagnosis", "Vaccination", "Vitals"] as const;

export default function RecordsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return medicalRecords.filter((r) => {
      const matchesType = type === "all" || r.type === type;
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [query, type]);

  return (
    <div>
      <PageHeader
        title="Medical Records"
        description="Your electronic health records from every visit, in one secure place."
      >
        
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grid flex-1 gap-1.5">
          <Label htmlFor="record-search">Search records</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="record-search"
              type="search"
              placeholder="Search by title, provider, or keyword"
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="record-type">Filter by type</Label>
          <Select value={type} onValueChange={(v) => setType(v as (typeof TYPES)[number])}>
            <SelectTrigger id="record-type" className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t === "all" ? "All types" : t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-medium">No records found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto p-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const meta = typeMeta[r.type];
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="whitespace-nowrap font-medium text-muted-foreground">
                          {formatDate(r.date)}
                        </TableCell>
                        <TableCell className="font-medium">{r.title}</TableCell>
                        <TableCell>
                          <StatusBadge tone={meta.tone}>{r.type}</StatusBadge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{r.provider}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedRecord(r)}
                            title="View Details"
                          >
                            <Eye className="size-4 text-primary" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Details Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        {selectedRecord && (
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </span>
                <div>
                  <DialogTitle className="text-lg">{selectedRecord.title}</DialogTitle>
                  <DialogDescription className="mt-0.5">
                    {selectedRecord.summary}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 rounded-lg bg-muted/50 p-4">
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UserRound className="size-3.5" aria-hidden="true" /> Provider
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{selectedRecord.provider}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Activity className="size-3.5" aria-hidden="true" /> Department
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{selectedRecord.department}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" aria-hidden="true" /> Date
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{formatDate(selectedRecord.date)}</dd>
                </div>
              </dl>

              <div>
                <h3 className="text-sm font-semibold mb-3">Clinical Details</h3>
                <ul className="space-y-2">
                  {selectedRecord.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t flex justify-end">
                <Button
                  onClick={() => toast.success(`Record ${selectedRecord.id} downloaded (demo).`)}
                  className="gap-2"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download Record
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
