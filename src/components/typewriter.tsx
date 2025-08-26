'use client';

import { useState, useEffect } from 'react';

type TypewriterProps = {
  text: string;
  speed?: number;
};

export function Typewriter({ text, speed = 20 }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => {
      clearInterval(timer);
    };
  }, [text, speed]);

  return <p className="whitespace-pre-wrap text-foreground">{displayedText}<span className="animate-pulse">|</span></p>;
}
