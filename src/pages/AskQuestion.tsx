
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AskQuestionForm from '@/components/AskQuestionForm';
import { toast } from '@/components/ui/sonner';

const AskQuestion = () => {
  const navigate = useNavigate();

  const handleSubmitQuestion = (questionData: any) => {
    // In a real app, we would submit this data to a backend
    console.log('Question submitted:', questionData);
    
    // Show success toast
    toast.success('Your question has been posted successfully!');
    
    // Redirect to home page after submission
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <AskQuestionForm onSubmit={handleSubmitQuestion} />
      </main>
    </div>
  );
};

export default AskQuestion;
