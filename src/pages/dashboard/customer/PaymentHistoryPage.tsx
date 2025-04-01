
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PaymentMethod } from '@/types/service';

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    date: new Date(),
    description: 'Payment for Home Cleaning Service',
    amount: 350,
    status: 'completed' as const,
    method: 'pay_today' as PaymentMethod,
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 2),
    description: 'Payment for Gardening Service',
    amount: 250,
    status: 'completed' as const,
    method: 'e_wallet' as PaymentMethod,
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000 * 5),
    description: 'Payment for Plumbing Service',
    amount: 450,
    status: 'completed' as const,
    method: 'easy_wallet' as PaymentMethod,
  },
];

const PaymentHistoryPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-muted-foreground">View all your past payments and transactions.</p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      N${transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.method === 'pay_today' ? 'Pay Today' : 
                       transaction.method === 'e_wallet' ? 'E-Wallet' : 'Easy Wallet'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistoryPage;
