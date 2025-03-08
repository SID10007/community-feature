
import React, { useState, useRef } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { extractQuestionDetails } from '@/services/geminiService';

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
      
      // For demo purposes, we'll simulate speech-to-text
      // In a real app, you would send the audio to a speech-to-text service
      
      // Simulate a 2-second delay for "transcription"
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock transcription (in real app, this would come from a speech-to-text service)
      const mockTranscription = "I want to know about agricultural loans for small farmers in Maharashtra. My name is Suresh Patil. I need details about interest rates and repayment periods.";
      
      // Now process this text with Gemini to extract structured information
      try {
        const result = await extractQuestionDetails(mockTranscription);
        onTranscriptionComplete(result);
        setIsProcessing(false);
        toast.success("Voice input processed successfully!");
      } catch (error) {
        console.error('Error processing with Gemini:', error);
        // Fallback to a different example than before
        const fallbackResult = {
          question: "What are agricultural loan options in Maharashtra?",
          description: "I need information about agricultural loans available for small farmers in Maharashtra. Specifically interested in interest rates and repayment periods.",
          name: "Suresh Patil",
          tags: ["agriculture", "loans", "maharashtra", "small farmers"]
        };
        onTranscriptionComplete(fallbackResult);
        setIsProcessing(false);
        toast.success("Voice input processed with fallback data!");
      }
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
