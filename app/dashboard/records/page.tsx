"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Download,
  FileText,
  Search,
  Stethoscope,
  Syringe,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, type Tone } from "@/components/dashboard/status-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
        <Button variant="outline" onClick={() => toast.success("Full record exported as PDF (demo).")}>
          <Download className="size-4" aria-hidden="true" />
          Export all
        </Button>
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

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">No records found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Accordion className="w-full">
              {filtered.map((r) => {
                const meta = typeMeta[r.type];
                const Icon = meta.icon;
                return (
                  <AccordionItem key={r.id} value={r.id} className="border-b last:border-b-0">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-1 items-start gap-3 text-left">
                        <span
                          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                          aria-hidden="true"
                        >
                          <Icon className="size-4.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{r.title}</span>
                            <StatusBadge tone={meta.tone}>{r.type}</StatusBadge>
                          </div>
                          <p className="mt-0.5 truncate text-sm text-muted-foreground">{r.summary}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-12">
                        <dl className="grid gap-3 sm:grid-cols-3">
                          <div>
                            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <UserRound className="size-3.5" aria-hidden="true" /> Provider
                            </dt>
                            <dd className="text-sm font-medium">{r.provider}</dd>
                          </div>
                          <div>
                            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <FileText className="size-3.5" aria-hidden="true" /> Department
                            </dt>
                            <dd className="text-sm font-medium">{r.department}</dd>
                          </div>
                          <div>
                            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarDays className="size-3.5" aria-hidden="true" /> Date
                            </dt>
                            <dd className="text-sm font-medium">{formatDate(r.date)}</dd>
                          </div>
                        </dl>
                        <h3 className="mt-4 text-sm font-semibold">Details</h3>
                        <ul className="mt-2 space-y-1.5">
                          {r.details.map((d) => (
                            <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                              {d}
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => toast.success(`Record ${r.id} downloaded (demo).`)}
                        >
                          <Download className="size-4" aria-hidden="true" />
                          Download record
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
