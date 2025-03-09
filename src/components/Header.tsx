
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MessageSquare, Menu, X, PlusCircle, User, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 w-full py-4 px-6 transition-all duration-300 bg-ey-black text-white`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-ey-gold text-2xl font-bold">V.A.R.U.N</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/">
              <Button 
                variant="ghost" 
                className="text-white hover:text-ey-gold"
              >
                Home
              </Button>
            </Link>
            <Link to="/ask">
              <Button 
                variant="ghost" 
                className="text-white hover:text-ey-gold"
              >
                Questions
              </Button>
            </Link>
            <Link to="/resources">
              <Button 
                variant="ghost" 
                className="text-white hover:text-ey-gold"
              >
                Resources
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                variant="ghost" 
                className="text-white hover:text-ey-gold"
              >
                About
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="ghost" 
                className="text-white hover:text-ey-gold"
              >
                Contact
              </Button>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              className="hidden md:flex text-white hover:text-ey-gold"
              asChild
            >
              <Link to="/signin">
                <span>Sign In</span>
              </Link>
            </Button>
            
            <Button 
              variant="default" 
              className="hidden md:flex bg-ey-gold text-ey-black hover:bg-ey-gold/90"
              asChild
            >
              <Link to="/signup">
                <span>Sign Up</span>
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-ey-black p-4 z-50 animate-slide-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={toggleMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white"
                >
                  Home
                </Button>
              </Link>
              <Link to="/ask" onClick={toggleMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white"
                >
                  Questions
                </Button>
              </Link>
              <Link to="/resources" onClick={toggleMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white"
                >
                  Resources
                </Button>
              </Link>
              <Link to="/about" onClick={toggleMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white"
                >
                  About
                </Button>
              </Link>
              <Link to="/contact" onClick={toggleMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white"
                >
                  Contact
                </Button>
              </Link>
              <div className="pt-4 border-t border-gray-800">
                <Link to="/signin" onClick={toggleMobileMenu}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={toggleMobileMenu}>
                  <Button 
                    variant="default" 
                    className="w-full justify-start mt-2 bg-ey-gold text-ey-black"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
