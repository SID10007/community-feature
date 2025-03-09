
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Bookmark, Share2 } from 'lucide-react';
import { toast } from "sonner";

interface QuestionCardProps {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  answerCount: number;
  createdAt: string;
  isTranslated?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  title,
  description,
  author,
  tags,
  answerCount,
  createdAt,
  isTranslated = false
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20) + 1);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? "Question removed from bookmarks" : "Question saved to bookmarks");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this would copy the URL to clipboard
    navigator.clipboard.writeText(`https://financequeryapp.com/question/${id}`);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Link to={`/question/${id}`}>
      <Card 
        className={`overflow-hidden hover-lift ${isTranslated ? 'border-primary/30' : ''}`}
        style={{
          transformOrigin: 'center',
          animation: 'pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          animationDelay: `${Math.random() * 0.5}s`
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-2 mb-2 pop-in" style={{ animationDelay: '0.1s' }}>
                {tags.map((tag, index) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="px-2 py-0.5 text-xs shine-hover"
                    style={{ 
                      animationDelay: `${0.1 + (index * 0.05)}s`,
                      opacity: 0,
                      animation: 'stagger-fade-in 0.5s ease forwards',
                      animationDelay: `${0.1 + (index * 0.05)}s`
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="line-clamp-2 text-lg font-semibold gradient-text">{title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 text-sm mb-4">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 floating">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">{author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{author.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:text-primary"
            >
              <Heart className={`h-4 w-4 ${liked ? 'text-red-500 fill-red-500' : ''} transition-all hover:scale-110`} />
              <span>{likeCount}</span>
            </button>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{answerCount}</span>
            </div>
            <button 
              onClick={handleSave}
              className="text-xs text-muted-foreground transition-all hover:text-primary"
            >
              <Bookmark className={`h-4 w-4 transition-all hover:scale-110 ${saved ? 'text-primary fill-primary' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="text-xs text-muted-foreground transition-all hover:text-primary"
            >
              <Share2 className="h-4 w-4 transition-all hover:scale-110" />
            </button>
            <span className="text-xs text-muted-foreground">{createdAt}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default QuestionCard;
