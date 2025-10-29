
import React from 'react';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from '@/types/user.types';
import { UserAvatar } from './UserAvatar';

interface DeleteUserDialogProps {
  open: boolean;
  user: User | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  user,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {user && (
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center gap-3">
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  size="md"
                />
                <div>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
