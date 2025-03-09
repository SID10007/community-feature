
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Mic } from 'lucide-react';
import Header from '@/components/Header';
import QuestionCard from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getMockQuestions, translateContent } from '@/services/geminiService';

const Index = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const data = getMockQuestions();
      setQuestions(data);
      setFilteredQuestions(data);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredQuestions(questions);
      return;
    }
    
    const filtered = questions.filter(
      q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredQuestions(filtered);
  };

  const trendingTopics = [
    "Farming Loans",
    "PM Kisan Yojana",
    "Bank Accounts",
    "Self Help Groups",
    "Micro Finance"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section h-[70vh] flex items-center justify-center">
        <div className="hero-content text-center max-w-4xl mx-auto px-4">
          <h1 className="hero-title text-5xl md:text-6xl font-bold mb-6">Rural Financial Community</h1>
          <p className="text-white text-xl mb-12">
            Ask questions and get answers about financial topics relevant to rural communities
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search financial questions..."
                  className="pl-4 pr-10 py-6 w-full rounded-l-full bg-white text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              <Button 
                type="submit"
                className="rounded-r-full bg-ey-gold text-black hover:bg-ey-gold/90 px-6"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          {/* Trending Topics */}
          <div className="flex flex-col items-center">
            <p className="text-white text-sm mb-3">Trending Topics:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {trendingTopics.map((topic) => (
                <Badge 
                  key={topic}
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-transparent"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ask a Question Button */}
      <div className="flex justify-center -mt-6 relative z-10">
        <Link to="/ask">
          <Button 
            className="bg-ey-gold text-black hover:bg-ey-gold/90 rounded-full px-6 py-6 font-medium"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Ask a Question
          </Button>
        </Link>
      </div>
      
      {/* Questions Section */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Recent Questions</h2>
          
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
                <Button className="bg-ey-gold text-black hover:bg-ey-gold/90">
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
