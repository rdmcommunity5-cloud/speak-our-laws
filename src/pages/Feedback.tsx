import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Feedback = () => {
  const [text, setText] = useState("");

  // Voice recording
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  // Video recording
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];
    mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      setAudioURL(URL.createObjectURL(blob));
    };
    mediaRecorder.current.start();
  };
  const stopAudio = () => mediaRecorder.current?.stop();

  const startVideo = async () => {
    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoRef.current) videoRef.current.srcObject = streamRef.current;
  };
  const stopVideo = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setVideoURL(videoRef.current?.srcObject ? (videoRef.current?.srcObject as MediaStream).id : null);
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <main className="container py-8 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Submit feedback</h1>
        <p className="text-muted-foreground">Share your perspective via text, voice, or video. Choose anonymous or verified after connecting Supabase.</p>
      </section>

      <Card className="p-4 card-elevated">
        <Tabs defaultValue="text">
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-3">
            <Textarea placeholder="Write your feedback..." value={text} onChange={(e) => setText(e.target.value)} />
            <div className="flex gap-3">
              <Button>Submit</Button>
              <Button variant="outline">Submit anonymously</Button>
            </div>
            <p className="text-xs text-muted-foreground">Storage and verification require Supabase.</p>
          </TabsContent>

          <TabsContent value="voice" className="space-y-3">
            <div className="flex gap-3">
              <Button onClick={startAudio}>Start</Button>
              <Button variant="outline" onClick={stopAudio}>Stop</Button>
            </div>
            {audioURL && (
              <audio controls src={audioURL} className="w-full" aria-label="Recorded audio" />
            )}
          </TabsContent>

          <TabsContent value="video" className="space-y-3">
            <div className="flex gap-3">
              <Button onClick={startVideo}>Start</Button>
              <Button variant="outline" onClick={stopVideo}>Stop</Button>
            </div>
            <video ref={videoRef} autoPlay muted className="w-full rounded-md border" />
            {videoURL && <p className="text-xs text-muted-foreground">Video recorded.</p>}
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
};

export default Feedback;
