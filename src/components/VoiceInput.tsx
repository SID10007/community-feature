
import React, { useState, useRef } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { extractQuestionDetails, transcribeAudio } from '@/services/geminiService';

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
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      setRecordingDuration(0);
      
      // Start a timer to track recording duration
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
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
      
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.info("Processing your voice input...");
    }
  };

  const handleAudioData = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Transcribe the audio using Whisper via Groq
      try {
        const transcription = await transcribeAudio(audioBlob);
        console.log("Transcription result:", transcription);
        
        if (transcription) {
          toast.info(`Transcribed: "${transcription.substring(0, 50)}${transcription.length > 50 ? '...' : ''}"`);
          
          // Process with Gemini
          try {
            const result = await extractQuestionDetails(transcription);
            onTranscriptionComplete(result);
            setIsProcessing(false);
            toast.success("Voice input processed successfully!");
          } catch (error) {
            console.error('Error processing with Gemini:', error);
            // Fallback to using just the transcription
            const fallbackResult = {
              question: transcription.split('.')[0] || "New Question",
              description: transcription,
              tags: ["voice", "question"]
            };
            onTranscriptionComplete(fallbackResult);
            setIsProcessing(false);
            toast.success("Voice processed with basic formatting.");
          }
        } else {
          throw new Error("Empty transcription received");
        }
      } catch (error) {
        console.error('Error during transcription:', error);
        toast.error("Failed to transcribe audio. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error handling audio data:', error);
      toast.error("Failed to process recording.");
      setIsProcessing(false);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant={isRecording ? "destructive" : "outline"}
        size="lg"
        className={`w-full rounded-md btn-transition flex items-center justify-center gap-2 ${
          isRecording ? 'animate-pulse-subtle shadow-lg shadow-primary/20' : ''
        }`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
      >
        <div className="relative">
          <Mic className={`h-5 w-5 ${isProcessing ? 'animate-spin' : ''}`} />
          {isRecording && (
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
          )}
        </div>
        <span>
          {isRecording 
            ? `Recording... ${formatTime(recordingDuration)}` 
            : isProcessing 
              ? "Processing..." 
              : "Speak Your Question"}
        </span>
      </Button>
      {isRecording && (
        <div className="mt-3 flex justify-center">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="bg-primary w-1 rounded-full animate-bounce"
                style={{ 
                  height: `${12 + Math.random() * 16}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.5s'
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
