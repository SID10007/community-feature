
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Header from '@/components/Header';
import QuestionCard from '@/components/QuestionCard';
import SearchBar from '@/components/SearchBar';
import TranslationButton from '@/components/TranslationButton';
import { Button } from '@/components/ui/button';
import { getMockQuestions, translateContent } from '@/services/geminiService';

const Index = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const data = getMockQuestions();
      setQuestions(data);
      setFilteredQuestions(data);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredQuestions(questions);
      return;
    }
    
    const filtered = questions.filter(
      q => 
        q.title.toLowerCase().includes(query.toLowerCase()) || 
        q.description.toLowerCase().includes(query.toLowerCase()) ||
        q.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredQuestions(filtered);
  };

  const handleTranslate = async (language: string) => {
    setCurrentLanguage(language);
    
    if (language === 'English') {
      // If switching back to English, just use the original data
      setFilteredQuestions(questions);
      setIsTranslated(false);
      return;
    }
    
    setIsLoading(true);
    
    // Translate each question with Gemini
    const translatedQuestions = await Promise.all(
      questions.map(async (q) => {
        const translatedTitle = await translateContent(q.title, language);
        const translatedDesc = await translateContent(q.description, language);
        
        return {
          ...q,
          title: translatedTitle,
          description: translatedDesc,
          originalLang: 'English',
        };
      })
    );
    
    setFilteredQuestions(translatedQuestions);
    setIsTranslated(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Financial Questions</h1>
              <p className="text-muted-foreground mt-1">
                Find answers to your financial queries or ask your own
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <TranslationButton onTranslate={handleTranslate} />
              
              <Link to="/ask">
                <Button className="btn-ripple btn-transition rounded-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
              </Link>
            </div>
          </div>
          
          <SearchBar onSearch={handleSearch} className="mb-8" />
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-40 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredQuestions.length > 0 ? (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <QuestionCard 
                  key={question.id}
                  {...question}
                  isTranslated={isTranslated}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-4">
                Try a different search term or ask a new question
              </p>
              <Link to="/ask">
                <Button className="btn-ripple btn-transition">
                  Ask a Question
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
