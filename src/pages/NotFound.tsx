
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import Container from '@/components/common/Container';
import Logo from '@/components/common/Logo';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b py-4">
        <Container>
          <Logo />
        </Container>
      </header>
      
      <Container className="flex-1 flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex justify-center">
            <Button 
              as={Link} 
              to="/" 
              variant="primary" 
              icon={<ArrowLeft className="h-4 w-4" />} 
              iconPosition="left"
            >
              Go Back Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
