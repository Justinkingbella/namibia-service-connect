
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableFooter,
  TableRow,
} from "@/components/ui/table"
import { PaymentPaymentMethod } from '@/types';

// Mock data for payment history
const paymentHistory = [
  {
    id: '1',
    date: '2024-01-20',
    description: 'Home Cleaning Service',
    amount: 150.00,
    status: 'Completed',
    method: 'Credit Card',
  },
  {
    id: '2',
    date: '2024-01-15',
    description: 'Grocery Delivery',
    amount: 75.50,
    status: 'Completed',
    method: 'PayToday',
  },
  {
    id: '3',
    date: '2024-01-10',
    description: 'Plumbing Repair',
    amount: 200.00,
    status: 'Completed',
    method: 'E-Wallet',
  },
  {
    id: '4',
    date: '2023-12-28',
    description: 'Dog Walking',
    amount: 30.00,
    status: 'Completed',
    method: 'Cash',
  },
  {
    id: '5',
    date: '2023-12-20',
    description: 'Home Cleaning Service',
    amount: 150.00,
    status: 'Completed',
    method: 'Credit Card',
  },
  {
    id: '6',
    date: '2023-12-15',
    description: 'Grocery Delivery',
    amount: 75.50,
    status: 'Completed',
    method: 'PayToday',
  },
  {
    id: '7',
    date: '2023-12-10',
    description: 'Plumbing Repair',
    amount: 200.00,
    status: 'Completed',
    method: 'E-Wallet',
  },
  {
    id: '8',
    date: '2023-11-28',
    description: 'Dog Walking',
    amount: 30.00,
    status: 'Completed',
    method: 'Cash',
  },
];

const PaymentHistoryPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <Table>
                <TableCaption>A history of all your payments.</TableCaption>
                <TableHead>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.date}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>${paymentHistory.reduce((acc, payment) => acc + payment.amount, 0).toFixed(2)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistoryPage;
