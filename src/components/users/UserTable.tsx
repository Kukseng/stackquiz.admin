
import React from 'react';
import { UserX } from 'lucide-react';
import { User } from '@/types/user.types';
import { UserTableRow } from './UserTableRow';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
  searchQuery: string;
  statusFilter: string;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onToggleStatus,
  onDelete,
  searchQuery,
  statusFilter,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <UserX className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || statusFilter !== "all" 
                      ? "No users match your filters" 
                      : "No users found"}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};