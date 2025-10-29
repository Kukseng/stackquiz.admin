

import React from 'react';
import { Mail, Calendar, MoreVertical, Pencil, UserX, UserCheck, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from '@/types/user.types';
import { UserAvatar } from './UserAvatar';

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <tr className="group hover:bg-muted/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            size="sm"
          />
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              @{user.username}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{user.email}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge variant={user.isActive ? "default" : "destructive"} className="gap-1">
          {user.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
              <Pencil className="h-4 w-4 mr-2" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(user)} className="cursor-pointer">
              {user.isActive ? (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Disable User
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Enable User
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};