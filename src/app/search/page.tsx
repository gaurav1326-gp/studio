'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search as SearchIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a search query.',
      });
      return;
    }

    setIsLoading(true);
    setResults('');

    // Placeholder for real-time search functionality
    // In a real implementation, you would call an AI flow here
    // that uses a tool to search the web.
    setTimeout(() => {
      setResults(`Search results for "${query}" would be displayed here. This feature is not yet fully implemented.`);
      setIsLoading(false);
    }, 1500);
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
              Real-time Search
            </h1>
            <p className="text-sm text-muted-foreground">
              Ask questions that require up-to-date information.
            </p>
          </div>
          <Logo className="h-12 w-12" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="w-full max-w-2xl">
            <div className="w-full flex gap-2 mb-8">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'What is the weather in London?'"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
                <SearchIcon className="mr-2" /> Search
              </Button>
            </div>
            
            <Card className="w-full min-h-[300px] flex items-center justify-center bg-card/50 overflow-hidden relative p-6">
              {isLoading ? (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-accent" />
                </div>
              ) : results ? (
                 <p className="text-center text-muted-foreground">{results}</p>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <SearchIcon className="mx-auto h-12 w-12 mb-4" />
                  <p>Your search results will appear here.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
