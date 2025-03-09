
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AskQuestionForm from '@/components/AskQuestionForm';
import { toast } from "sonner";

const AskQuestion = () => {
  const navigate = useNavigate();

  const handleSubmitQuestion = (questionData: any) => {
    // Create a new question object with the necessary format
    const newQuestion = {
      id: `q${Date.now()}`, // Generate a unique ID using timestamp
      title: questionData.title,
      description: questionData.description,
      author: {
        name: questionData.author || 'Anonymous',
        avatar: "",
      },
      tags: questionData.tags,
      answerCount: 0,
      createdAt: "Just now",
    };
    
    // Get existing questions from localStorage or initialize an empty array
    const existingQuestions = JSON.parse(localStorage.getItem('userQuestions') || '[]');
    
    // Add the new question to the array
    const updatedQuestions = [newQuestion, ...existingQuestions];
    
    // Save back to localStorage
    localStorage.setItem('userQuestions', JSON.stringify(updatedQuestions));

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
