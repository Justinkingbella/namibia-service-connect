
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';
import Button from '../common/Button';
import Container from '../common/Container';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface NavbarProps {
  className?: string;
}

const menuItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent',
        className
      )}
    >
      <Container className="flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Sign Up</Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -mr-2 text-foreground hover:text-primary transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-40 bg-white/90 backdrop-blur-md md:hidden flex flex-col animate-fade-in">
          <Container className="py-8">
            <ul className="flex flex-col space-y-5">
              {menuItems.map((item) => (
                <li key={item.label} className="border-b border-border pb-3">
                  <Link
                    to={item.href}
                    className="flex items-center justify-between text-foreground hover:text-primary py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-base font-medium">{item.label}</span>
                    {item.children && <ChevronDown size={18} />}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-3 mt-8">
              <Button variant="outline" size="lg" className="w-full">
                Sign In
              </Button>
              <Button size="lg" className="w-full">
                Sign Up
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

export default Navbar;
