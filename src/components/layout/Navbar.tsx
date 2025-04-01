
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';
import Button from '../common/Button';
import Container from '../common/Container';
import { useAuth } from '@/contexts/AuthContext';

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
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
          
          {user ? (
            <div className="relative">
              <button 
                className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
                <ChevronDown size={16} />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User size={16} />
                    Dashboard
                  </Link>
                  <button 
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" as={Link} to="/auth/sign-in">
                Sign In
              </Button>
              <Button size="sm" as={Link} to="/auth/sign-up">
                Sign Up
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {user && (
            <Link to="/dashboard" className="mr-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {user.name.charAt(0)}
              </div>
            </Link>
          )}
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
        <div className="fixed inset-0 top-[60px] z-40 bg-white/95 backdrop-blur-md md:hidden flex flex-col animate-fade-in">
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
            
            {user ? (
              <div className="flex flex-col space-y-3 mt-8">
                <Button as={Link} to="/dashboard" size="lg" className="w-full">
                  Dashboard
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 mt-8">
                <Button as={Link} to="/auth/sign-in" variant="outline" size="lg" className="w-full">
                  Sign In
                </Button>
                <Button as={Link} to="/auth/sign-up" size="lg" className="w-full">
                  Sign Up
                </Button>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}

export default Navbar;
