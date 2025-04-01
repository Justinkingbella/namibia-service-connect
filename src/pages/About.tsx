
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Target, Users } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import DynamicSection from '@/components/common/DynamicSection';
import { getPageSections, PageSection } from '@/services/contentService';
import { useSite } from '@/contexts/SiteContext';

const About = () => {
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSite();

  useEffect(() => {
    const fetchPageSections = async () => {
      setIsLoading(true);
      try {
        const sections = await getPageSections('about');
        setPageSections(sections);
      } catch (error) {
        console.error('Error fetching about page sections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageSections();
  }, []);

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Trust & Reliability",
      description: "We verify all service providers to ensure quality and reliability for all customers."
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description: "We continuously improve our platform to make service booking easier and more efficient."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community",
      description: "We're building a community of trusted service providers and satisfied customers across Namibia."
    }
  ];

  const team = [
    {
      name: "Jane Doe",
      role: "Founder & CEO",
      image: "/placeholder.svg",
      bio: "Jane founded Namibia Service Hub with a vision to transform how services are discovered and booked in Namibia."
    },
    {
      name: "John Smith",
      role: "CTO",
      image: "/placeholder.svg",
      bio: "John oversees the technical development of the platform, ensuring a smooth and reliable experience for all users."
    },
    {
      name: "Mary Johnson",
      role: "Customer Success Manager",
      image: "/placeholder.svg",
      bio: "Mary is dedicated to ensuring both customers and service providers have the best experience on our platform."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <DynamicSection 
                pageName="about" 
                sectionName="hero"
                showEditButton
                className="space-y-4"
              >
                {(section) => (
                  <>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{section.title}</h1>
                    <p className="text-lg text-muted-foreground mb-8">{section.subtitle}</p>
                    <Button asChild size="lg">
                      <Link to="/contact">Get in Touch</Link>
                    </Button>
                  </>
                )}
              </DynamicSection>
              <FadeIn delay={200}>
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                  <img 
                    src={pageSections.find(s => s.section_name === 'hero')?.image_url || "/placeholder.svg"} 
                    alt="About Namibia Service Hub" 
                    className="w-full h-full object-cover"
                  />
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
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                  <img 
                    src={pageSections.find(s => s.section_name === 'story')?.image_url || "/placeholder.svg"} 
                    alt="Our Story" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
              <DynamicSection 
                pageName="about" 
                sectionName="story"
                showEditButton
                className="space-y-4"
              >
                {(section) => (
                  <>
                    <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
                    <p className="text-muted-foreground mb-4">
                      {section.content}
                    </p>
                  </>
                )}
              </DynamicSection>
            </div>
          </Container>
        </section>

        {/* Our Values */}
        <section className="py-16 md:py-24 bg-gray-50">
          <Container>
            <DynamicSection 
              pageName="about" 
              sectionName="values"
              showEditButton
              className="text-center mb-16"
            >
              {(section) => (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold">{section.title}</h2>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {section.subtitle}
                  </p>
                </>
              )}
            </DynamicSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <FadeIn key={value.title} delay={index * 100}>
                  <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{value.title}</h3>
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
            <DynamicSection 
              pageName="about" 
              sectionName="team"
              showEditButton
              className="text-center mb-16"
            >
              {(section) => (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold">{section.title}</h2>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {section.subtitle}
                  </p>
                </>
              )}
            </DynamicSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <FadeIn key={member.name} delay={index * 100}>
                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <p className="text-primary font-medium mb-4">{member.role}</p>
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
