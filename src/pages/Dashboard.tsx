import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { VotePanel } from "@/components/voting/VotePanel";

interface Bill {
  id: string;
  title: string;
  summary: string;
  issues: string[];
}

const MOCK_BILLS: Bill[] = [
  {
    id: "b1",
    title: "Community Safety and Crime Prevention Act",
    summary:
      "Adds neighborhood patrol grants, expands youth programs, and updates sentencing for repeat violent offenses.",
    issues: ["crime", "youth", "budget"],
  },
  {
    id: "b2",
    title: "Primary Care Access and Telehealth Expansion",
    summary:
      "Funds rural clinics, reimburses telehealth visits, and supports mental health staffing for schools.",
    issues: ["healthcare", "rural", "education"],
  },
  {
    id: "b3",
    title: "Small Business Relief & Innovation",
    summary:
      "Cuts red tape, introduces micro-grants, and offers tax credits for green upgrades.",
    issues: ["economy", "small-business", "environment"],
  },
];

const allTags = Array.from(new Set(MOCK_BILLS.flatMap((b) => b.issues)));

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return MOCK_BILLS.filter((b) => {
      const matchesQuery = [b.title, b.summary].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => b.issues.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [query, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <main className="container py-8 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Bills dashboard</h1>
        <p className="text-muted-foreground">Plain-language summaries, tagged by issue.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr,380px]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search bills"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search bills"
            />
            <Button variant="outline" onClick={() => { setQuery(""); setActiveTags([]); }}>Clear</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <Badge key={t} variant={activeTags.includes(t) ? "default" : "secondary"} onClick={() => toggleTag(t)} className="cursor-pointer">
                {t}
              </Badge>
            ))}
          </div>

          <div className="grid gap-4">
            {filtered.map((b) => (
              <Card key={b.id} className="card-elevated">
                <CardHeader>
                  <CardTitle>{b.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{b.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {b.issues.map((i) => (
                      <Badge key={i} variant="secondary">{i}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary">Read more</Button>
                    <Button variant="hero">Ask AI about this bill</Button>
                  </div>
                  <VotePanel lawId={b.id} lawTitle={b.title} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <AIAssistant />
          <Card className="p-4 card-elevated">
            <h3 className="font-semibold mb-2">Stay informed</h3>
            <p className="text-sm text-muted-foreground mb-3">Enable push notifications to get new bills and deadlines.</p>
            <Button variant="outline">Enable notifications</Button>
            <p className="text-xs text-muted-foreground mt-2">Requires Supabase & browser permission.</p>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
