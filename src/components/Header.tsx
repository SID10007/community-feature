
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MessageSquare, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 w-full py-4 px-6 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm dark:bg-black/80' : 'bg-transparent'
    }`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative w-7 h-7 rounded-full bg-primary flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
              <MessageSquare className="h-4 w-4 text-white absolute group-hover:scale-0 transition-transform duration-300" />
              <MessageSquare className="h-4 w-4 text-white absolute group-hover:scale-100 scale-0 rotate-0 group-hover:rotate-[360deg] transition-all duration-500" />
            </div>
            <span className="text-xl font-semibold gradient-text">FinanceQuery</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={location.pathname === '/' ? "default" : "ghost"} 
                className="btn-transition relative overflow-hidden group"
              >
                <span className="relative z-10">Home</span>
                {location.pathname === '/' && (
                  <span className="absolute inset-0 bg-primary opacity-90 scale-x-100 group-hover:scale-x-0 origin-left transition-transform duration-300"></span>
                )}
              </Button>
            </Link>
            <Link to="/ask">
              <Button 
                variant={location.pathname === '/ask' ? "default" : "ghost"} 
                className="btn-transition relative overflow-hidden group"
              >
                <span className="relative z-10">Ask Question</span>
                {location.pathname === '/ask' && (
                  <span className="absolute inset-0 bg-primary opacity-90 scale-x-100 group-hover:scale-x-0 origin-left transition-transform duration-300"></span>
                )}
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                variant={location.pathname === '/about' ? "default" : "ghost"} 
                className="btn-transition relative overflow-hidden group"
              >
                <span className="relative z-10">About</span>
                {location.pathname === '/about' && (
                  <span className="absolute inset-0 bg-primary opacity-90 scale-x-100 group-hover:scale-x-0 origin-left transition-transform duration-300"></span>
                )}
              </Button>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Link to="/search">
              <Button 
                variant="ghost" 
                size="icon" 
                className="btn-transition rounded-full hover:bg-primary/10"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="translate-btn btn-transition rounded-full hover:border-primary/50"
                >
                  <Globe className="h-4 w-4" />
                  <span>Translate</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 animate-scale-in">
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">English</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">Spanish</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">French</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">German</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">Chinese</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-primary/10"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              ) : (
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full hover:bg-primary/10"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-gray-900 p-4 z-50 animate-slide-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={toggleMobileMenu}>
                <Button 
                  variant={location.pathname === '/' ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  Home
                </Button>
              </Link>
              <Link to="/ask" onClick={toggleMobileMenu}>
                <Button 
                  variant={location.pathname === '/ask' ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  Ask Question
                </Button>
              </Link>
              <Link to="/about" onClick={toggleMobileMenu}>
                <Button 
                  variant={location.pathname === '/about' ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  About
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
