
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import Container from '@/components/common/Container';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useSite } from '@/contexts/SiteContext';

const Footer = () => {
  const { settings } = useSite();
  
  // Get footer links from settings or use defaults
  const footerLinks = Array.isArray(settings.footer_links) 
    ? settings.footer_links 
    : [
        { label: "Home", url: "/" },
        { label: "Services", url: "/services" },
        { label: "About Us", url: "/about" },
        { label: "Contact", url: "/contact" },
        { label: "How It Works", url: "/how-it-works" }
      ];
  
  // Get copyright text from settings or use default
  const copyright = settings.copyright || '© 2023 Namibia Service Hub. All rights reserved.';
      
  const categories = [
    { name: "Home Services", url: "/services#home" },
    { name: "Transportation", url: "/services#transport" },
    { name: "Professional Services", url: "/services#professional" },
    { name: "Health & Wellness", url: "/services#health" },
  ];
  
  const resources = [
    { name: "Blog", url: "#" },
    { name: "Help Center", url: "#" },
    { name: "Pricing", url: "#" },
    { name: "Providers", url: "#" },
  ];
  
  const company = [
    { name: "About Us", url: "/about" },
    { name: "Contact", url: "/contact" },
    { name: "Careers", url: "#" },
    { name: "Privacy Policy", url: "#" },
  ];
  
  const socialLinks = [
    { icon: <Facebook size={20} />, url: "https://facebook.com" },
    { icon: <Twitter size={20} />, url: "https://twitter.com" },
    { icon: <Instagram size={20} />, url: "https://instagram.com" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo variant="light" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Connecting quality service providers with customers across Namibia. Find, book, and enjoy reliable services.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link.url}
                  className="bg-gray-800 p-2 rounded-full hover:bg-primary/80 transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((item, i) => (
                <li key={i}>
                  <Link to={item.url} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((item, i) => (
                <li key={i}>
                  <Link to={item.url} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {company.map((item, i) => (
                <li key={i}>
                  <Link to={item.url} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              {copyright}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {footerLinks.map((link, i) => (
                <Link 
                  key={i} 
                  to={link.url} 
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
