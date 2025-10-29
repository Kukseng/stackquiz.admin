
import { User } from '@/types/user.types';

export const filterUsersBySearch = (users: User[], query: string): User[] => {
  if (!query) return users;
  
  const lowerQuery = query.toLowerCase();
  return users.filter(user => 
    user.username?.toLowerCase().includes(lowerQuery) ||
    user.email?.toLowerCase().includes(lowerQuery) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowerQuery)
  );
};

export const filterUsersByStatus = (users: User[], status: string): User[] => {
  if (status === 'all') return users;
  return users.filter(user => 
    status === 'active' ? user.isActive : !user.isActive
  );
};
