
import React, { useState, useRef } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { processVoiceInput } from '@/services/geminiService';

interface VoiceInputProps {
  onTranscriptionComplete: (data: {
    question: string;
    description: string;
    name?: string;
    tags: string[];
  }) => void;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscriptionComplete, className }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
      toast.info("Recording started. Describe your question in detail...");
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
      toast.info("Processing your voice input...");
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
        
        // For demo purposes, simulate processing with Gemini
        // In a real app, you'd send the audio to a speech-to-text service and then to Gemini
        setTimeout(() => {
          // Mock result for demonstration
          const result = {
            question: "How to apply for a small business loan?",
            description: "I have a small dairy farm and want to expand my business. I need information about government schemes or banks that provide loans to rural entrepreneurs with minimal paperwork.",
            name: "Ramesh Kumar",
            tags: ["business loan", "agriculture", "government scheme"]
          };
          
          onTranscriptionComplete(result);
          setIsProcessing(false);
          toast.success("Voice input processed successfully!");
        }, 2000);
      };
    } catch (error) {
      console.error('Error handling audio data:', error);
      toast.error("Failed to process recording.");
      setIsProcessing(false);
    }
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant={isRecording ? "destructive" : "outline"}
        size="lg"
        className={`w-full rounded-md btn-transition flex items-center justify-center gap-2 ${
          isRecording ? 'animate-pulse-subtle' : ''
        }`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
      >
        <Mic className={`h-5 w-5 ${isProcessing ? 'animate-spin' : ''}`} />
        <span>
          {isRecording 
            ? "Stop Recording" 
            : isProcessing 
              ? "Processing..." 
              : "Speak Your Question"}
        </span>
      </Button>
      {isRecording && (
        <p className="text-sm text-center mt-2 text-muted-foreground animate-pulse">
          Recording... Click the button again to stop.
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
