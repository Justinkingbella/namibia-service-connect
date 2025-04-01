
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@/components/common/Container';
import Logo from '@/components/common/Logo';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useSite } from '@/contexts/SiteContext';

const Footer = () => {
  const { settings } = useSite();
  
  const footerLinks = settings.footer_links || [
    { label: 'Home', url: '/' },
    { label: 'Services', url: '/services' },
    { label: 'About Us', url: '/about' },
    { label: 'Contact', url: '/contact' },
    { label: 'How It Works', url: '/how-it-works' }
  ];
  
  const copyrightText = settings.copyright || '© 2023 Namibia Service Hub. All rights reserved.';
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="mt-4 text-gray-400 text-sm">
              Connecting service providers with customers across Namibia.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.slice(0, 4).map((link, index) => (
                <li key={index}>
                  <Link to={link.url} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Innovation Hub</li>
              <li>Windhoek, Namibia</li>
              <li>info@namibiaservicehub.com</li>
              <li>+264 81 234 5678</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-sm text-center text-gray-400">
          <p>{copyrightText}</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
