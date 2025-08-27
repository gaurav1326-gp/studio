
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { getDailyBriefing } from '@/ai/flows/get-daily-briefing';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NewsPage() {
  const [briefing, setBriefing] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetBriefing = async () => {
    setIsLoading(true);
    setBriefing('');

    try {
      const result = await getDailyBriefing();
      setBriefing(result.briefing);
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to fetch the daily briefing. Please try again later.',
        });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetBriefing();
  }, []);

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
              Daily Newspaper
            </h1>
            <p className="text-sm text-muted-foreground">
              Your daily briefing, powered by AI.
            </p>
          </div>
          <Logo className="h-12 w-12" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="w-full max-w-3xl">
            <Card className="w-full min-h-[50vh] flex flex-col bg-card/50 overflow-hidden relative">
              <CardContent className="p-6 flex-1">
                {isLoading ? (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-accent" />
                  </div>
                ) : briefing ? (
                   <ReactMarkdown
                      className="prose prose-invert max-w-none"
                      remarkPlugins={[remarkGfm]}
                    >
                      {briefing}
                    </ReactMarkdown>
                ) : (
                  <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center h-full">
                    <Newspaper className="mx-auto h-12 w-12 mb-4" />
                    <p>Click the button to get your daily briefing.</p>
                  </div>
                )}
              </CardContent>
               <div className="p-4 border-t border-border/50 flex justify-center">
                 <Button onClick={handleGetBriefing} disabled={isLoading}>
                    <Newspaper className="mr-2" /> Get Today's Briefing
                </Button>
               </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
