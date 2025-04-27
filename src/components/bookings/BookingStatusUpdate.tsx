
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookingStatus } from '@/types/booking';

interface BookingStatusUpdateProps {
  currentStatus: BookingStatus;
  onUpdateStatus: (newStatus: BookingStatus, notes?: string) => Promise<void>;
  userRole: string;
}

const BookingStatusUpdate: React.FC<BookingStatusUpdateProps> = ({
  currentStatus,
  onUpdateStatus,
  userRole
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Define available status transitions based on role and current status
  const availableStatusesMap: Record<string, Record<string, BookingStatus[]>> = {
    provider: {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.REJECTED],
      [BookingStatus.CONFIRMED]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
      [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.REJECTED]: []
    },
    customer: {
      [BookingStatus.PENDING]: [BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.CANCELLED],
      [BookingStatus.IN_PROGRESS]: [],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.REJECTED]: []
    }
  };

  // Admin can change to any status
  const adminStatuses: BookingStatus[] = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED, 
    BookingStatus.IN_PROGRESS, 
    BookingStatus.COMPLETED, 
    BookingStatus.CANCELLED, 
    BookingStatus.REJECTED, 
    BookingStatus.NO_SHOW, 
    BookingStatus.RESCHEDULED, 
    BookingStatus.DISPUTED
  ];

  const statusOptions = userRole === 'admin' 
    ? adminStatuses
    : (availableStatusesMap[userRole] && availableStatusesMap[userRole][currentStatus]) || [];

  const handleUpdate = async () => {
    if (!newStatus) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(newStatus, notes);
      setIsDialogOpen(false);
      setNewStatus('');
      setNotes('');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        disabled={statusOptions.length === 0}
      >
        Update Status
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status of this booking from "{currentStatus}" to a new status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as BookingStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any relevant details about this status change"
                className="min-h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!newStatus || isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingStatusUpdate;
