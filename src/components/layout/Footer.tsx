
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Logo from '../common/Logo';
import Container from '../common/Container';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
  simple?: boolean;
}

export function Footer({ className, simple = false }: FooterProps) {
  if (simple) {
    return (
      <footer className={cn("bg-white border-t py-6", className)}>
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Logo />
            <div className="mt-4 sm:mt-0 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Namibia Service Hub. All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    );
  }

  return (
    <footer className={cn("bg-white border-t", className)}>
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-muted-foreground text-sm mb-4">
              Your one-stop marketplace for local services in Namibia. Connecting customers with trusted service providers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Errand Services</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Home Services</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Skilled Professionals</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Freelancers</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Transportation</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Health & Wellness</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Press</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  123 Independence Avenue, Windhoek, Namibia
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+264 61 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">info@namibiaservicehub.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Namibia Service Hub. All rights reserved.
          </div>
          
          <div className="flex space-x-4 text-sm">
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
