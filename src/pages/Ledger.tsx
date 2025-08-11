import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLedgerRecords, type VoteRecord } from "@/lib/voting";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const voteTypes = ["all", "yes", "no", "abstain"] as const;

type VoteFilter = typeof voteTypes[number];

const Ledger = () => {
  const [region, setRegion] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [voteType, setVoteType] = useState<VoteFilter>("all");
  const [records, setRecords] = useState<VoteRecord[]>([]);

  useEffect(() => {
    setRecords(getLedgerRecords());
  }, []);

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(from).getTime() : -Infinity;
    const toTs = to ? new Date(to).getTime() + 86_400_000 - 1 : Infinity;
    return records.filter((r) => {
      const regionOk = region ? (r.region || "").toLowerCase().includes(region.toLowerCase()) : true;
      const dateOk = r.timestamp >= fromTs && r.timestamp <= toTs;
      const voteOk = voteType === "all" ? true : r.voteType === voteType;
      return regionOk && dateOk && voteOk;
    });
  }, [records, region, from, to, voteType]);

  const perLaw = useMemo(() => {
    const map: Record<string, { lawId: string; yes: number; no: number; abstain: number }> = {};
    for (const r of filtered) {
      if (!map[r.lawId]) map[r.lawId] = { lawId: r.lawId, yes: 0, no: 0, abstain: 0 };
      map[r.lawId][r.voteType]++;
    }
    return Object.values(map);
  }, [filtered]);

  const exportCSV = () => {
    const header = ["lawId","voteType","region","timestamp","txHash","userIdHash","walletAddress"];
    const rows = filtered.map(r => [r.lawId, r.voteType, r.region || "", new Date(r.timestamp).toISOString(), r.txHash, r.userIdHash, r.walletAddress || ""]);
    const csv = [header, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "civic-ledger.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Civic Engagement Ledger (Demo)", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["lawId","voteType","region","timestamp","txHash"]],
      body: filtered.map(r => [r.lawId, r.voteType, r.region || "", new Date(r.timestamp).toLocaleString(), r.txHash]),
      styles: { fontSize: 8 },
      theme: "grid",
    });
    doc.save("civic-ledger.pdf");
  };

  return (
    <main className="container py-8 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Civic Ledger</h1>
        <p className="text-muted-foreground">Transparent, pseudonymous record of public consultation (demo).</p>
      </section>

      <section className="grid gap-6 md:grid-cols-[380px,1fr]">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm mb-1 block">Region</label>
              <Input placeholder="Region or ward" value={region} onChange={(e) => setRegion(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm mb-1 block">From</label>
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-sm mb-1 block">To</label>
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm mb-1 block">Vote type</label>
              <Select value={voteType} onValueChange={(v) => setVoteType(v as VoteFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {voteTypes.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={exportCSV} variant="secondary">Export CSV</Button>
              <Button onClick={exportPDF} variant="outline">Export PDF</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Votes per law</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perLaw}>
                <XAxis dataKey="lawId" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="yes" stackId="v" fill="hsl(var(--flag-green))" name="Yes" radius={6} />
                <Bar dataKey="no" stackId="v" fill="hsl(var(--flag-red))" name="No" radius={6} />
                <Bar dataKey="abstain" stackId="v" fill="hsl(var(--flag-yellow))" name="Abstain" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Ledger records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Law</TableHead>
                    <TableHead>Vote</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead>Tx</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.lawId}</TableCell>
                      <TableCell className="capitalize">{r.voteType}</TableCell>
                      <TableCell>{r.region || "—"}</TableCell>
                      <TableCell>{new Date(r.timestamp).toLocaleString()}</TableCell>
                      <TableCell title={r.txHash}>{r.txHash.slice(0, 18)}…</TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No records match these filters.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Ledger;
