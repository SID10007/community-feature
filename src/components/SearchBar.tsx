
import React, { useState, useRef } from 'react';
import { Search, Mic } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { cn } from '@/lib/utils';
import { processVoiceInput } from '@/services/geminiService';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = handleAudioData;
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started. Speak your question now.");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Couldn't access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleAudioData = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert audio to base64 or process it as needed
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // For demo purposes, simulate processing audio with Gemini
        toast.info("Processing your voice input...");
        
        try {
          // Here we'd send the audio to a speech-to-text service and then to Gemini
          // For now, we'll simulate this with a delay
          setTimeout(async () => {
            const result = await processVoiceInput(base64Audio);
            setQuery(result);
            onSearch(result);
            setIsProcessing(false);
          }, 1500);
        } catch (error) {
          console.error('Error processing audio:', error);
          toast.error("Failed to process voice input.");
          setIsProcessing(false);
        }
      };
    } catch (error) {
      console.error('Error handling audio data:', error);
      toast.error("Failed to process recording.");
      setIsProcessing(false);
    }
  };

  return (
    <Card className={cn("overflow-hidden shadow-sm", className)}>
      <CardContent className="p-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for financial questions..."
              className="pl-9 pr-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            className={`rounded-full btn-transition ${isRecording ? 'animate-pulse-subtle' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          <Button type="submit" className="rounded-md btn-ripple btn-transition">
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
