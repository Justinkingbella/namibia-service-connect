
import React from 'react';
import { Layout } from '@/components/common/Container';
import { CheckCircle, Search, Calendar, Star } from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How <span className="text-primary">NamibiaService.com</span> Works
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We connect service providers in Namibia with customers who need their services,
              making it easy to discover, book, and manage service appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6">For Customers</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Search size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">1. Find Services</h3>
                    <p className="text-gray-600">
                      Browse through various service categories or search for specific services you need. 
                      Filter by location, price, ratings, and more.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">2. Book with Ease</h3>
                    <p className="text-gray-600">
                      Select a service provider, choose a convenient date and time, and book your appointment.
                      Pay securely through our platform or arrange direct payment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">3. Receive Service</h3>
                    <p className="text-gray-600">
                      The provider will come to you or you can visit their location, depending on the service.
                      Get notifications and reminders about your upcoming appointments.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Star size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">4. Rate and Review</h3>
                    <p className="text-gray-600">
                      After your service is complete, leave a review and rating to help others make informed decisions
                      and to provide valuable feedback to service providers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">For Service Providers</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">1. Sign Up and Get Verified</h3>
                    <p className="text-gray-600">
                      Create your provider profile, add your services, and complete the verification process
                      to establish trust with potential customers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">2. Manage Bookings</h3>
                    <p className="text-gray-600">
                      Receive booking requests, approve appointments, and manage your availability
                      through our user-friendly dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">3. Provide Great Service</h3>
                    <p className="text-gray-600">
                      Deliver quality service to your customers based on the agreed schedule and terms.
                      Communicate directly with clients through our messaging system.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Star size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">4. Get Paid and Grow</h3>
                    <p className="text-gray-600">
                      Receive payments securely through our platform. Build your reputation with positive reviews
                      and expand your customer base in Namibia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I pay for services?</h3>
                <p className="text-gray-600">
                  We offer multiple payment options including mobile money, bank transfers, cash, and digital wallets.
                  You can choose the payment method that works best for you at checkout.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How are service providers verified?</h3>
                <p className="text-gray-600">
                  All service providers undergo our verification process which includes identity verification,
                  business registration checks, and credential validation where applicable.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I cancel a booking?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel bookings through your dashboard. Please note that cancellation policies
                  may vary by service provider and timing of cancellation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I become a service provider?</h3>
                <p className="text-gray-600">
                  Sign up as a provider on our platform, complete your profile information, add your services,
                  and submit the required verification documents. Our team will review and approve your profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorksPage;
