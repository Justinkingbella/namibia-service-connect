
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/auth';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer' as UserRole,
    status: 'active',
    joinDate: '2023-05-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'provider' as UserRole,
    status: 'active',
    joinDate: '2023-06-21',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'provider' as UserRole,
    status: 'pending',
    joinDate: '2023-07-03',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'customer' as UserRole,
    status: 'inactive',
    joinDate: '2023-04-12',
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@namibiaservice.com',
    role: 'admin' as UserRole,
    status: 'active',
    joinDate: '2023-01-01',
  },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState<UserRole | 'all'>('all');

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(user => user.role === filter);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'provider': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50">Pending</Badge>;
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-muted-foreground text-sm">Manage users and their permissions</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'admin' ? 'primary' : 'outline'} 
            onClick={() => setFilter('admin')}
          >
            Admins
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'provider' ? 'primary' : 'outline'} 
            onClick={() => setFilter('provider')}
          >
            Providers
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'customer' ? 'primary' : 'outline'} 
            onClick={() => setFilter('customer')}
          >
            Customers
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getRoleBadgeColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(user.status)}
                    <span className="text-sm capitalize ml-1">{user.status}</span>
                  </div>
                </TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      {user.status === 'active' ? (
                        <DropdownMenuItem className="text-amber-600">Deactivate</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-600">Activate</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
