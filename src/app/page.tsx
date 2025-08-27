'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Mic, Play, SendHorizonal, Square, Lightbulb, Image as ImageIcon, Video, XCircle, Wand2, Headset, Search, Newspaper } from 'lucide-react';

import { answerUserQuestion } from '@/ai/flows/answer-user-question';
import { synthesizeTextToSpeech } from '@/ai/flows/synthesize-text-to-speech';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Typewriter } from '@/components/typewriter';
import { Logo } from '@/components/logo';
import { Clock } from '@/components/clock';

type Attachment = {
  type: 'image' | 'video';
  dataUri: string;
};

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      const handleEnded = () => setIsPlaying(false);
      audioEl.addEventListener('ended', handleEnded);
      return () => {
        audioEl.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment({ type, dataUri: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const askQuestion = async (text: string) => {
    if ((!text.trim() && !attachment) || isLoading) return;

    setQuestion(text);
    setIsLoading(true);
    setAnswer('');
    setAudioDataUri(null);
    setIsPlaying(false);

    try {
      const input: { question: string, media?: Attachment } = { question: text };
      if (attachment) {
        input.media = attachment;
      }
      const result = await answerUserQuestion(input);
      setAnswer(result.answer);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get an answer. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setAttachment(null);
      setQuestion('');
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestion(question);
  };

  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioDataUri && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    if (!answer || isSynthesizing) return;

    setIsSynthesizing(true);
    try {
      const result = await synthesizeTextToSpeech(answer);
      setAudioDataUri(result.media);
      if (audioRef.current) {
        audioRef.current.src = result.media;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to synthesize audio. Please try again.',
      });
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleMicClick = () => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      toast({
        title: 'Listening...',
        description: 'Voice input is not fully implemented yet.',
      });
    }
  };

  const IconGlowWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="[filter:drop-shadow(0_0_3px_hsl(var(--accent)))]">
      {children}
    </div>
  );

  const suggestedQuestions = [
    'Explain the difference between TypeScript and JavaScript.',
    'What are the best practices for React performance optimization?',
    'What are the health benefits of intermittent fasting?',
    'Suggest a study plan for learning a new programming language.',
  ];

  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.2),rgba(255,255,255,0))]"></div>
      <main className="container mx-auto flex h-screen flex-col p-4 md:p-8">
        <header className="flex w-full items-start justify-between gap-4 text-left mb-8">
            <div className='flex items-center gap-4'>
              <Logo />
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-400 sm:text-5xl uppercase">
                  GWGP
                </h1>
                <p className="mt-1 text-lg text-muted-foreground max-w-2xl">
                  Your futuristic AI assistant.
                </p>
              </div>
            </div>
            <Clock />
        </header>
        
        <div className="flex flex-col items-center flex-1 gap-8">
          <div className="w-full max-w-3xl flex-grow flex flex-col justify-center">
            <div className="w-full rounded-lg bg-gradient-to-br from-primary/50 via-purple-600/50 to-accent/50 p-0.5 shadow-2xl shadow-primary/20 h-full">
              <Card className="h-full w-full rounded-[7px] bg-card/80 backdrop-blur-sm relative">
                <ScrollArea className="absolute inset-0 h-full w-full">
                  <CardContent className="p-4 md:p-6 min-h-[200px] flex items-center justify-center">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        </div>
                      ) : answer ? (
                        <Typewriter text={answer} speed={10}/>
                      ) : (
                        <p className="text-center text-muted-foreground">The answer to your query will appear here.</p>
                      )}
                  </CardContent>
                </ScrollArea>
                {answer && !isLoading && (
                  <div className="absolute bottom-4 right-4 z-10">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full text-accent hover:bg-accent/20 hover:text-accent"
                      onClick={handlePlayAudio}
                      disabled={isSynthesizing}
                      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                    >
                      <IconGlowWrapper>
                        {isSynthesizing ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isisPlaying ? (
                          <Square className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </IconGlowWrapper>
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4">
            {attachment && (
              <div className="relative mx-auto max-w-xs">
                {attachment.type === 'image' ? (
                  <img src={attachment.dataUri} alt="Preview" className="rounded-md max-h-40" />
                ) : (
                  <video src={attachment.dataUri} controls className="rounded-md max-h-40" />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 rounded-full h-6 w-6 bg-background/50 hover:bg-background"
                  onClick={() => setAttachment(null)}
                >
                  <XCircle className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            )}
            <div className="relative">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full rounded-lg border-2 bg-card/80 p-4 pr-36 text-base backdrop-blur-sm focus:ring-accent focus:border-accent"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-1">
                <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => handleFileChange(e, 'image')} className="hidden" />
                <input type="file" accept="video/*" ref={videoInputRef} onChange={(e) => handleFileChange(e, 'video')} className="hidden" />

                <Button type="button" size="icon" variant="ghost" onClick={() => imageInputRef.current?.click()} className="rounded-full hover:bg-accent/20" aria-label="Add image">
                  <ImageIcon className="h-5 w-5 text-accent" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => videoInputRef.current?.click()} className="rounded-full hover:bg-accent/20" aria-label="Add video">
                  <Video className="h-5 w-5 text-accent" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleMicClick}
                  className="rounded-full hover:bg-accent/20"
                  aria-label="Use microphone"
                >
                  <Mic className={`h-5 w-5 text-accent transition-all ${isListening ? 'animate-pulse-glow' : ''}`} />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isLoading || (!question.trim() && !attachment)}
                  aria-label="Send question"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <SendHorizonal className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="w-full max-w-3xl mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 uppercase">
                    <Lightbulb className="text-accent h-5 w-5" />
                    Suggestions
                    </h2>
                    <div className="flex flex-col gap-3">
                    {suggestedQuestions.map((q, i) => (
                        <Card
                        key={i}
                        className="p-3.5 cursor-pointer hover:bg-card/90 transition-colors bg-card/70 border-border/70"
                        onClick={() => askQuestion(q)}
                        >
                        <p className="text-sm text-muted-foreground">{q}</p>
                        </Card>
                    ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 uppercase">
                    <Wand2 className="text-accent h-5 w-5" />
                    Tools
                    </h2>
                    <Card
                        className="p-3.5 cursor-pointer hover:bg-card/90 transition-colors bg-card/70 border-border/70"
                    >
                        <Link href="/edit" className="flex items-center gap-2">
                        <ImageIcon className="text-accent/80" />
                        <p className="text-sm text-muted-foreground">AI Image Editor</p>
                        </Link>
                    </Card>
                    <Card
                        className="p-3.5 cursor-pointer hover:bg-card/90 transition-colors bg-card/70 border-border/70"
                    >
                        <Link href="/voice" className="flex items-center gap-2">
                        <Headset className="text-accent/80" />
                        <p className="text-sm text-muted-foreground">Voice Assistant</p>
                        </Link>
                    </Card>
                    <Card
                        className="p-3.5 cursor-pointer hover:bg-card/90 transition-colors bg-card/70 border-border/70"
                    >
                        <Link href="/search" className="flex items-center gap-2">
                        <Search className="text-accent/80" />
                        <p className="text-sm text-muted-foreground">Real-time Search</p>
                        </Link>
                    </Card>
                    <Card
                        className="p-3.5 cursor-pointer hover:bg-card/90 transition-colors bg-card/70 border-border/70"
                    >
                        <Link href="/news" className="flex items-center gap-2">
                        <Newspaper className="text-accent/80" />
                        <p className="text-sm text-muted-foreground">Daily Newspaper</p>
                        </Link>
                    </Card>
                </div>
            </div>
          </div>
        </div>
        <audio ref={audioRef} />
      </main>
    </>
  );
}
