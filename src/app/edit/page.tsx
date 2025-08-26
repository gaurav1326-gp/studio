'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wand2, Loader2, Image as ImageIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { editImage } from '@/ai/flows/edit-image-flow';
import { Logo } from '@/components/logo';

export default function EditPage() {
  const [prompt, setPrompt] = useState('');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSample, setIsSample] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setEditedImage(null);
        setIsSample(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleImage = () => {
    const sampleImageUrl = 'https://picsum.photos/seed/imagedit/1024/1024';
    // We need to fetch the image and convert it to a data URI
    fetch(sampleImageUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setOriginalImage(event.target?.result as string);
          setEditedImage(null);
          setIsSample(true);
        }
        reader.readAsDataURL(blob);
      });
  };

  const handleEditImage = async () => {
    if (!originalImage || !prompt.trim() || isLoading) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please upload an image and enter a prompt.',
      });
      return;
    }

    setIsLoading(true);
    setEditedImage(null);

    try {
      const result = await editImage({
        photoDataUri: originalImage,
        prompt: prompt,
      });
      setEditedImage(result.editedPhotoDataUri);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Editing Failed',
        description: 'Failed to edit the image. Please try again.',
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
              AI Image Editor
            </h1>
            <p className="text-sm text-muted-foreground">
              Describe the changes you want to make to your image.
            </p>
          </div>
          <Logo className="h-12 w-12" />
        </header>

        <div className="flex-1 flex flex-col md:flex-row gap-8 items-start justify-center py-8">
          <div className="w-full md:w-1/2 flex flex-col gap-4 items-center">
            <h2 className="text-lg font-semibold">Original Image</h2>
            <Card className="w-full aspect-square flex items-center justify-center bg-card/50 overflow-hidden">
              {originalImage ? (
                <img src={originalImage} alt="Original" className="object-contain h-full w-full" data-ai-hint={isSample ? 'woman portrait' : ''} />
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                  <p>Upload an image to start editing</p>
                  <p className="text-xs mt-2">or</p>
                  <Button variant="link" onClick={handleUseSampleImage} className="mt-1">Use a Sample Image</Button>
                </div>
              )}
            </Card>
            <Button onClick={() => imageInputRef.current?.click()} className="w-full">
              <ImageIcon className="mr-2" /> Upload Image
            </Button>
            <input type="file" accept="image/*" ref={imageInputRef} onChange={handleFileChange} className="hidden" />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4 items-center">
            <h2 className="text-lg font-semibold">Edited Image</h2>
            <Card className="w-full aspect-square flex items-center justify-center bg-card/50 overflow-hidden relative">
              {isLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-accent" />
                </div>
              )}
              {editedImage ? (
                 <>
                  <img src={editedImage} alt="Edited" className="object-contain h-full w-full" />
                   <Button asChild size="icon" className="absolute bottom-4 right-4 rounded-full">
                      <a href={editedImage} download="edited-image.png">
                        <Download />
                      </a>
                    </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <Wand2 className="mx-auto h-12 w-12 mb-4" />
                  <p>Your edited image will appear here.</p>
                </div>
              )}
            </Card>
            <div className="w-full flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Make the background a futuristic city'"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditImage();
                }}
              />
              <Button onClick={handleEditImage} disabled={isLoading || !originalImage || !prompt.trim()}>
                <Wand2 className="mr-2" /> Edit
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
