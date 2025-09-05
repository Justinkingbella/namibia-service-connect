
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMock2FA } from './useMockAuth';

interface User2FA {
  userId: string;
  isEnabled: boolean;
  secret?: string;
  backupCodes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const use2FA = () => {
  // Since user_2fa table doesn't exist, return mock data
  return useMock2FA();
};
