'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Mic, Play, SendHorizonal, Square, Lightbulb } from 'lucide-react';

import { answerUserQuestion } from '@/ai/flows/answer-user-question';
import { synthesizeTextToSpeech } from '@/ai/flows/synthesize-text-to-speech';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Typewriter } from '@/components/typewriter';
import { Logo } from '@/components/logo';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
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

  const askQuestion = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setQuestion(text);
    setIsLoading(true);
    setAnswer('');
    setAudioDataUri(null);
    setIsPlaying(false);

    try {
      const result = await answerUserQuestion({ question: text });
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
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.3),rgba(255,255,255,0))]"></div>
      <main className="container mx-auto flex h-screen p-4 md:p-8">
        <div className="flex flex-1 gap-8">
          <div className="flex flex-1 flex-col justify-between">
            <header className="flex flex-col items-center text-center">
              <Logo />
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-400 sm:text-5xl uppercase">
                GWGP
              </h1>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
                Your futuristic AI assistant. Ask me about coding, computer languages, health, and studies.
              </p>
            </header>

            <div className="w-full max-w-3xl flex-grow flex flex-col justify-center my-8 mx-auto">
              <div className="w-full rounded-lg bg-gradient-to-br from-primary via-purple-600 to-accent p-0.5 shadow-2xl shadow-primary/20">
                <Card className="h-full w-full rounded-[7px]">
                  <CardContent className="p-4 md:p-6 min-h-[200px] flex items-center justify-center relative">
                    <ScrollArea className="h-full max-h-[40vh] w-full pr-4">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        </div>
                      ) : answer ? (
                        <Typewriter text={answer} />
                      ) : (
                        <p className="text-center text-muted-foreground">The answer to your query will appear here.</p>
                      )}
                    </ScrollArea>
                    {answer && !isLoading && (
                      <div className="absolute bottom-4 right-4">
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
                            ) : isPlaying ? (
                              <Square className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                          </IconGlowWrapper>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4 mx-auto">
              <div className="relative">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full rounded-lg border-2 bg-card/80 p-4 pr-24 text-base backdrop-blur-sm focus:ring-accent focus:border-accent"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
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
                    disabled={isLoading || !question.trim()}
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
          </div>

          <aside className="hidden md:flex flex-col gap-4 w-80">
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
          </aside>
        </div>
        <audio ref={audioRef} />
      </main>
    </>
  );
}
