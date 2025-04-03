
// Update the status comparison to use the updated BookingStatus type
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'disputed':
      return 'bg-orange-100 text-orange-800';
    case 'no_show':
      return 'bg-gray-100 text-gray-800';
    case 'rescheduled':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
