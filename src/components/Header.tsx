
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-civic to-civic-purple flex items-center justify-center">
            <span className="font-bold text-white text-xl">S</span>
          </div>
          <Link to="/" className="font-bold text-2xl text-foreground">Substance</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground">Dashboard</Link>
          <Link to="/actions" className="text-foreground/80 hover:text-foreground">Log Action</Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground">About</Link>
          <Button asChild variant="outline" className="ml-4">
            <Link to="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/sign-up">Get Started</Link>
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden focus:outline-none" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 space-y-4 bg-background border-b border-border">
          <Link 
            to="/dashboard" 
            className="block py-2 text-foreground/80 hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/actions" 
            className="block py-2 text-foreground/80 hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Log Action
          </Link>
          <Link 
            to="/about" 
            className="block py-2 text-foreground/80 hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <div className="pt-2 flex flex-col space-y-3">
            <Button asChild variant="outline">
              <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
