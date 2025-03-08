import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TranslationButton from '@/components/TranslationButton';
import { Card, CardContent } from '@/components/ui/card';
import { getMockQuestions, getMockAnswers, translateContent } from '@/services/geminiService';
import { toast } from "sonner";

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const allQuestions = getMockQuestions();
      const questionData = allQuestions.find(q => q.id === id);
      
      if (questionData) {
        setQuestion(questionData);
        const answersData = getMockAnswers(id || '');
        setAnswers(answersData);
      }
      
      setIsLoading(false);
    }, 800);
  }, [id]);

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      const newAnswerObj = {
        id: `new-${Date.now()}`,
        content: newAnswer,
        author: {
          name: "You",
          avatar: "",
        },
        createdAt: "Just now",
        isAccepted: false,
      };
      
      setAnswers([...answers, newAnswerObj]);
      setNewAnswer('');
      setIsSubmitting(false);
      toast.success("Your answer has been posted!");
    }, 1000);
  };

  const handleTranslate = async (language: string) => {
    setCurrentLanguage(language);
    
    if (!question) return;
    
    if (language === 'English') {
      // Reload original data
      const allQuestions = getMockQuestions();
      const questionData = allQuestions.find(q => q.id === id);
      if (questionData) setQuestion(questionData);
      
      const answersData = getMockAnswers(id || '');
      setAnswers(answersData);
      return;
    }
    
    setIsLoading(true);
    
    // Translate question
    const translatedTitle = await translateContent(question.title, language);
    const translatedDesc = await translateContent(question.description, language);
    
    setQuestion({
      ...question,
      title: translatedTitle,
      description: translatedDesc,
    });
    
    // Translate answers
    const translatedAnswers = await Promise.all(
      answers.map(async (answer) => {
        const translatedContent = await translateContent(answer.content, language);
        return {
          ...answer,
          content: translatedContent,
        };
      })
    );
    
    setAnswers(translatedAnswers);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="h-8 bg-muted rounded w-40 animate-pulse mb-4"></div>
            <div className="h-10 bg-muted rounded w-full animate-pulse mb-4"></div>
            <div className="h-40 bg-muted rounded w-full animate-pulse mb-8"></div>
            <div className="h-40 bg-muted rounded w-full animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Question not found</h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Questions
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/">
              <Button variant="ghost" className="btn-transition">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Questions
              </Button>
            </Link>
            
            <TranslationButton onTranslate={handleTranslate} />
          </div>
          
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.author.avatar} alt={question.author.name} />
                <AvatarFallback>{question.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{question.author.name}</span>
              <span>•</span>
              <span>{question.createdAt}</span>
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <p className="whitespace-pre-line">{question.description}</p>
              </CardContent>
            </Card>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Answers ({answers.length})
                </h2>
              </div>
              
              {answers.length > 0 ? (
                <div className="space-y-6">
                  {answers.map((answer) => (
                    <Card key={answer.id} className={`animate-fade-in ${answer.isAccepted ? 'border-primary/30' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar>
                            <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                            <AvatarFallback>{answer.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{answer.author.name}</h3>
                            <p className="text-sm text-muted-foreground">{answer.createdAt}</p>
                          </div>
                          {answer.isAccepted && (
                            <Badge variant="outline" className="ml-auto border-primary/50 text-primary">
                              Accepted Answer
                            </Badge>
                          )}
                        </div>
                        <p className="whitespace-pre-line">{answer.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="animate-fade-in">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No answers yet. Be the first to answer!</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
              
              <Textarea
                placeholder="Write your answer here..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={6}
                className="mb-4"
              />
              
              <Button 
                onClick={handleSubmitAnswer} 
                disabled={!newAnswer.trim() || isSubmitting}
                className="btn-ripple"
              >
                {isSubmitting ? "Posting..." : "Post Your Answer"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionDetail;
