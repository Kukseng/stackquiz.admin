import React from 'react';
import { UserCheck, UserX } from 'lucide-react';

interface UserStatsCardsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({
  totalUsers,
  activeUsers,
  inactiveUsers,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50">
            <UserCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalUsers}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-green-50">
            <UserCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{activeUsers}</p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-red-50">
            <UserX className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{inactiveUsers}</p>
            <p className="text-xs text-muted-foreground">Inactive Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};