
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingCard } from '@/components/dashboard/BookingCard'; // Named import
import { useAuth } from '@/contexts/AuthContext';
import { Container } from '@/components/ui/container';
import { useBookings } from '@/hooks/useBookings';
import { EmptyState } from '@/components/ui/empty-state';
import { BookingWithDetails } from '@/types/booking';

const BookingsPage = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [view, setView] = useState<string>('list');

  const {
    bookings,
    loading,
    error,
    refetch
  } = useBookings();

  useEffect(() => {
    if (user) {
      // Just refetch without params since useBookings definition changed
      refetch();
    }
  }, [user, status, sortBy, sortOrder, refetch]);

  const filteredBookings = bookings;

  if (loading) {
    return <div className="flex justify-center p-8">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading bookings. Please try again later.</div>;
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Your Bookings</h2>
            <p className="text-muted-foreground">Manage your service bookings</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="totalAmount">Amount</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <EmptyState
            title="No bookings found"
            description="You don't have any bookings yet."
            linkText="Explore Services"
            link="/services"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking as BookingWithDetails & { serviceName: string; serviceImage?: string; providerName?: string; customerName?: string; }}
                viewAs={user.role === 'provider' ? 'provider' : 'customer'}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default BookingsPage;
