
import React, { useState, useRef } from 'react';
import { Search, Mic } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
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
      
      toast.info("Processing your voice input...");
      
      try {
        // Simulate a slight delay for "transcription"
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, we would upload this blob to a server with speech-to-text capabilities
        // For now, we'll simulate with some varied examples
        const demoQueries = [
          "How do I apply for a Kisan Credit Card?",
          "What are the benefits of Jan Dhan account?",
          "Tell me about farm loan waiver schemes",
          "How to get crop insurance?",
          "What are the current interest rates for agricultural loans?"
        ];
        
        // Pick a random query
        const randomIndex = Math.floor(Math.random() * demoQueries.length);
        const mockTranscription = demoQueries[randomIndex];
        
        console.log("Mock search query:", mockTranscription);
        
        // Process with Gemini
        const result = await processVoiceInput(mockTranscription);
        setQuery(result);
        onSearch(result);
        setIsProcessing(false);
        toast.success("Voice input processed!");
      } catch (error) {
        console.error('Error processing audio:', error);
        // Use a different fallback
        const fallbackQuery = "pension schemes for rural citizens";
        setQuery(fallbackQuery);
        onSearch(fallbackQuery);
        setIsProcessing(false);
        toast.info("Used fallback query due to processing error");
      }
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
