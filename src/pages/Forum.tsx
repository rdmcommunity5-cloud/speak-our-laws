import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Comment {
  id: string;
  author: string;
  content: string;
}

interface Post {
  id: string;
  author: string;
  content: string;
  votes: number;
  sentiment: "positive" | "neutral" | "negative";
  comments: Comment[];
}

const initialPosts: Post[] = [
  {
    id: "p1",
    author: "Alex",
    content:
      "I like the mental health funding but would prefer clearer accountability.",
    votes: 12,
    sentiment: "positive",
    comments: [
      { id: "c1", author: "Maya", content: "Agree. Transparency matters." },
    ],
  },
  {
    id: "p2",
    author: "Sam",
    content: "Concerned about small businesses handling new requirements.",
    votes: 5,
    sentiment: "neutral",
    comments: [],
  },
];

const sentimentColor: Record<Post["sentiment"], "default" | "secondary" | "destructive"> = {
  positive: "default",
  neutral: "secondary",
  negative: "destructive",
};

const Forum = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    const newPost: Post = {
      id: Math.random().toString(36).slice(2),
      author: "You",
      content: draft.trim(),
      votes: 0,
      sentiment: "neutral", // Replace with AI moderation later
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setDraft("");
  };

  const upvote = (id: string) => {
    setPosts((all) => all.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p)));
  };

  const reply = (id: string, text: string) => {
    setPosts((all) =>
      all.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: Math.random().toString(36).slice(2), author: "You", content: text },
              ],
            }
          : p
      )
    );
  };

  return (
    <main className="container py-8 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Public discussion</h1>
        <p className="text-muted-foreground">Post, upvote, and reply. Sentiment is AI-assisted (placeholder).</p>
      </section>

      <section className="space-y-4">
        <Card className="card-elevated">
          <CardContent className="p-4 space-y-3">
            <Textarea placeholder="Share your perspective..." value={draft} onChange={(e) => setDraft(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={submit}>Post</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {posts.map((p) => (
            <Card key={p.id} className="card-elevated">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{p.author}</CardTitle>
                <Badge variant={sentimentColor[p.sentiment]}>Sentiment: {p.sentiment}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>{p.content}</p>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => upvote(p.id)}>▲ {p.votes}</Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Replies</p>
                  {p.comments.map((c) => (
                    <div key={c.id} className="rounded-md border p-3">
                      <p className="text-sm font-medium mb-1">{c.author}</p>
                      <p className="text-sm text-muted-foreground">{c.content}</p>
                    </div>
                  ))}
                  <ReplyBox onSubmit={(txt) => reply(p.id, txt)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

const ReplyBox = ({ onSubmit }: { onSubmit: (t: string) => void }) => {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2">
      <Textarea placeholder="Reply..." value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={() => { if (text.trim()) { onSubmit(text.trim()); setText(""); } }}>Send</Button>
    </div>
  );
};

export default Forum;
