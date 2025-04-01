
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Target, Users } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import ContentBlock from '@/components/content/ContentBlock';

const About = () => {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Trust & Reliability",
      description: "We verify all service providers to ensure quality and reliability for all customers."
    },
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Innovation",
      description: "We continuously improve our platform to make service booking easier and more efficient."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Community",
      description: "We're building a community of trusted service providers and satisfied customers across Namibia."
    }
  ];

  const team = [
    {
      name: "Jane Doe",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      bio: "Jane founded Namibia Service Hub with a vision to transform how services are discovered and booked in Namibia."
    },
    {
      name: "John Smith",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      bio: "John oversees the technical development of the platform, ensuring a smooth and reliable experience for all users."
    },
    {
      name: "Mary Johnson",
      role: "Customer Success Manager",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      bio: "Mary is dedicated to ensuring both customers and service providers have the best experience on our platform."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-blue-100">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ContentBlock 
                pageName="about" 
                blockName="hero"
                showEditButton
                className="space-y-4"
              >
                {(content) => (
                  <>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h1>
                    <p className="text-lg text-muted-foreground mb-8">{content.subtitle}</p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600">
                      <Link to="/contact">Get in Touch</Link>
                    </Button>
                  </>
                )}
              </ContentBlock>
              <FadeIn delay={200}>
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <ContentBlock 
                    pageName="about" 
                    blockName="hero"
                    showEditButton={false}
                  >
                    {(content) => (
                      <img 
                        src={content.image_url || "/placeholder.svg"} 
                        alt="About Namibia Service Hub" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </ContentBlock>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <ContentBlock 
                    pageName="about" 
                    blockName="story"
                    showEditButton={false}
                  >
                    {(content) => (
                      <img 
                        src={content.image_url || "/placeholder.svg"} 
                        alt="Our Story" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </ContentBlock>
                </div>
              </FadeIn>
              <ContentBlock 
                pageName="about" 
                blockName="story"
                showEditButton
                className="space-y-4"
              >
                {(content) => (
                  <>
                    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {content.content}
                    </p>
                  </>
                )}
              </ContentBlock>
            </div>
          </Container>
        </section>

        {/* Our Values */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-blue-100">
          <Container>
            <ContentBlock 
              pageName="about" 
              blockName="values"
              showEditButton
              className="text-center mb-16"
            >
              {(content) => (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <FadeIn key={value.title} delay={index * 100}>
                  <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-blue-800">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Our Team */}
        <section className="py-16 md:py-24">
          <Container>
            <ContentBlock 
              pageName="about" 
              blockName="team"
              showEditButton
              className="text-center mb-16"
            >
              {(content) => (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <FadeIn key={member.name} delay={index * 100}>
                  <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-blue-800">{member.name}</h3>
                      <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                      <p className="text-muted-foreground">{member.bio}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
