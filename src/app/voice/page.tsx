'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mic, Bot, User } from 'lucide-react';

import { answerUserQuestion } from '@/ai/flows/answer-user-question';
import { synthesizeTextToSpeech } from '@/ai/flows/synthesize-text-to-speech';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { languageCodes } from '@/lib/language-codes';

interface ConversationTurn {
  speaker: 'user' | 'ai';
  text: string;
}

export default function VoicePage() {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null); // Using any for SpeechRecognition
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for SpeechRecognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserSpeech(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          variant: 'destructive',
          title: 'Speech Recognition Error',
          description: event.error,
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
        toast({
            variant: 'destructive',
            title: 'Speech Recognition Not Supported',
            description: 'Your browser does not support the Web Speech API.',
        });
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, [language]);

  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
         toast({
            variant: 'destructive',
            title: 'Speech Recognition Not Ready',
            description: 'Please wait a moment and try again.',
        });
      }
    }
  };

  const handleUserSpeech = async (text: string) => {
    if (!text.trim()) return;

    setConversation((prev) => [...prev, { speaker: 'user', text }]);
    setIsLoading(true);

    try {
      // Get AI answer
      const answerResult = await answerUserQuestion({ question: text });
      const aiText = answerResult.answer;
      setConversation((prev) => [...prev, { speaker: 'ai', text: aiText }]);
      
      // Synthesize and play audio
      const ttsResult = await synthesizeTextToSpeech(aiText);
      if (audioRef.current) {
        audioRef.current.src = ttsResult.media;
        audioRef.current.play();
      }

    } catch (error) {
      console.error(error);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setConversation((prev) => [...prev, { speaker: 'ai', text: errorMessage }]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to process your request.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTurn = (turn: ConversationTurn, index: number) => (
    <div key={index} className={`flex items-start gap-4 my-4 ${turn.speaker === 'user' ? 'justify-end' : ''}`}>
      {turn.speaker === 'ai' && <Bot className="h-8 w-8 text-primary flex-shrink-0" />}
      <div className={`p-4 rounded-xl max-w-lg ${turn.speaker === 'ai' ? 'bg-primary/10' : 'bg-accent/10 text-right'}`}>
        <p className="font-semibold capitalize">{turn.speaker}</p>
        <p className="text-muted-foreground">{turn.text}</p>
      </div>
      {turn.speaker === 'user' && <User className="h-8 w-8 text-accent flex-shrink-0" />}
    </div>
  );

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
              Voice Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Select a language and click the microphone to speak.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {Object.entries(languageCodes).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <Logo className="h-12 w-12" />
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-2xl h-[60vh] bg-card/50 rounded-lg p-4">
                 <ScrollArea className="h-full w-full pr-4">
                    {conversation.length === 0 && !isListening && (
                        <p className="text-center text-muted-foreground h-full flex items-center justify-center">Your conversation will appear here.</p>
                    )}
                    {conversation.map(renderTurn)}
                    {isListening && !isLoading && (
                        <div className="flex justify-center items-center gap-2 my-4">
                           <p className="text-muted-foreground text-center animate-pulse">Listening...</p>
                        </div>
                    )}
                    {isLoading && (
                         <div className="flex justify-center items-center gap-2 my-4">
                            <Loader2 className="h-6 w-6 animate-spin text-accent" />
                           <p className="text-muted-foreground text-center">Thinking...</p>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <Button
            size="icon"
            onClick={handleListen}
            disabled={isLoading}
            className={`rounded-full h-20 w-20 transition-all duration-300 ${isListening ? 'bg-destructive hover:bg-destructive/90 animate-pulse-glow' : 'bg-accent hover:bg-accent/90'}`}
          >
            <Mic className="h-10 w-10" />
          </Button>
          <p className="text-sm text-muted-foreground">
            {isListening ? 'Click to stop' : 'Click to speak'}
          </p>
        </div>

        <audio ref={audioRef} />
      </main>
    </>
  );
}
