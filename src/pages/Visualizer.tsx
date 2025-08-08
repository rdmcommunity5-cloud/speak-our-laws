import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const professions = ["Nurse", "Teacher", "Small Business Owner", "Student", "Parent"] as const;

type Profession = typeof professions[number];

const Visualizer = () => {
  const [profession, setProfession] = useState<Profession>("Nurse");
  const [location, setLocation] = useState("");

  const data = useMemo(() => {
    // Mocked impact scores; replace with real policy analysis later
    const base = {
      costs: profession === "Small Business Owner" ? 65 : 35,
      benefits: profession === "Nurse" ? 78 : profession === "Teacher" ? 70 : 52,
      services: profession === "Parent" ? 68 : 50,
    };
    return [
      { name: "Costs", value: base.costs },
      { name: "Benefits", value: base.benefits },
      { name: "Services", value: base.services },
    ];
  }, [profession, location]);

  return (
    <main className="container py-8 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Personalized impact</h1>
        <p className="text-muted-foreground">Visualize how laws might affect you based on your situation.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-[380px,1fr]">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>About you</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">Profession</label>
              <Select value={profession} onValueChange={(v) => setProfession(v as Profession)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Location</label>
              <Input placeholder="City or postcode" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <Button variant="secondary">Save profile</Button>
            <p className="text-xs text-muted-foreground">Connect Supabase to store your preferences securely.</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Estimated impact</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 360 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--brand))" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Visualizer;
