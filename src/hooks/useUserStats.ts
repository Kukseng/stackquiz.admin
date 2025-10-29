
import { useMemo } from 'react';
import { User } from '@/types/user.types';

export const useUserStats = (users: User[]) => {
  return useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    inactiveUsers: users.filter(u => !u.isActive).length,
  }), [users]);
};