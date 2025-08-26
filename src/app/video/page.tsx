'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wand2, Loader2, Download, VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateVideo } from '@/ai/flows/generate-video-flow';
import { Logo } from '@/components/logo';

export default function VideoPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleGenerateVideo = async () => {
    if (!prompt.trim() || isLoading) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a prompt.',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedVideo(null);

    try {
      const result = await generateVideo({
        prompt: prompt,
      });
      setGeneratedVideo(result.videoDataUri);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Video Generation Failed',
        description: 'Failed to generate the video. The model may be overloaded. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.2),rgba(255,255,255,0))]"></div>
      <main className="container mx-auto flex h-screen flex-col p-4 md:p-8">
        <header className="flex items-center justify-between">
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <ArrowLeft />
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-400 uppercase">
              AI Video Generator
            </h1>
            <p className="text-sm text-muted-foreground">
              Describe the video you want the AI to create.
            </p>
          </div>
          <Logo className="h-12 w-12" />
        </header>

        <div className="flex-1 flex flex-col gap-8 items-center justify-center py-8">
           <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-4 items-center">
            <Card className="w-full aspect-video flex items-center justify-center bg-card/50 overflow-hidden relative">
              {isLoading && (
                <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center text-center p-4">
                  <Loader2 className="h-12 w-12 animate-spin text-accent" />
                  <p className="text-muted-foreground mt-4">Generating video... This may take a minute or two.</p>
                </div>
              )}
              {generatedVideo ? (
                 <>
                  <video src={generatedVideo} controls autoPlay loop className="object-contain h-full w-full" />
                   <Button asChild size="icon" className="absolute bottom-4 right-4 rounded-full">
                      <a href={generatedVideo} download="generated-video.mp4">
                        <Download />
                      </a>
                    </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <VideoIcon className="mx-auto h-12 w-12 mb-4" />
                  <p>Your generated video will appear here.</p>
                </div>
              )}
            </Card>
            <div className="w-full flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'A majestic dragon soaring over a mystical forest at dawn.'"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerateVideo();
                }}
              />
              <Button onClick={handleGenerateVideo} disabled={isLoading || !prompt.trim()}>
                <Wand2 className="mr-2" /> Generate
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
