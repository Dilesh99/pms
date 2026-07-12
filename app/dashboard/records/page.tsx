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
  Plus,
} from "lucide-react";
import { useSession } from "@/components/providers/session-provider";
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
  DialogTrigger,
  DialogFooter,
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
  const { role } = useSession();
  const isAdmin = role === "admin";
  
  const [list, setList] = useState<MedicalRecord[]>(medicalRecords);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((r) => {
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
        {isAdmin && <AddRecordDialog onAdd={(rec) => setList((prev) => [rec, ...prev])} />}
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
            <div className="hidden md:block overflow-x-auto p-5 pb-0">
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
          {filtered.length > 0 && (
            <div className="md:hidden flex flex-col gap-4 p-4 border-t">
              {filtered.map((r) => {
                const meta = typeMeta[r.type];
                return (
                  <div key={`mobile-${r.id}`} className="flex flex-col gap-3 rounded-xl border p-4 shadow-sm bg-card">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold leading-none text-foreground">{r.title}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(r.date)}</p>
                      </div>
                      <StatusBadge tone={meta.tone}>{r.type}</StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground">Provider: {r.provider}</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setSelectedRecord(r)}
                    >
                      <Eye className="mr-2 size-4 text-primary" /> View Details
                    </Button>
                  </div>
                );
              })}
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

function AddRecordDialog({ onAdd }: { onAdd: (record: MedicalRecord) => void }) {
  const [open, setOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<MedicalRecord["type"]>("Consultation");
  const [provider, setProvider] = useState("");
  const [department, setDepartment] = useState("");
  const [summary, setSummary] = useState("");
  
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientName || !title || !provider || !department || !summary) {
      toast.error("Please fill out all required fields.");
      return;
    }
    
    const newRecord: MedicalRecord = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      type,
      provider,
      department,
      date: new Date().toISOString().split("T")[0],
      summary,
      details: ["Added manually by admin"],
      patientName,
    };
    
    onAdd(newRecord);
    toast.success("Medical record added successfully!");
    setOpen(false);
    
    setPatientName("");
    setTitle("");
    setType("Consultation");
    setProvider("");
    setDepartment("");
    setSummary("");
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" /> Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Medical Record</DialogTitle>
          <DialogDescription>
            Create a new medical record for a specific patient.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input id="patientName" placeholder="E.g., Amara Perez" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Record Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v: any) => setType(v)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.filter(t => t !== "all").map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input id="provider" placeholder="Dr. Name" value={provider} onChange={(e) => setProvider(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Input id="summary" placeholder="Brief summary..." value={summary} onChange={(e) => setSummary(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (Optional)</Label>
            <Input id="attachment" type="file" className="cursor-pointer" />
          </div>
          <DialogFooter className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
