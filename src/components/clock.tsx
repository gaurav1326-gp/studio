'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial time on the client to avoid hydration mismatch
    setTime(new Date());

    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Loading...';
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };


  return (
     <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-5 w-5 text-accent" />
        <div className="flex flex-col text-right">
            <span>{formatDate(time)}</span>
            <span className="font-mono">{formatTime(time)}</span>
        </div>
    </div>
  );
}
