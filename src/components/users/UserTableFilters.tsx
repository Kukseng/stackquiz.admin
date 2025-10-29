
import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserTableFiltersProps {
  searchQuery: string;
  statusFilter: string;
  isRefreshing: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
}

export const UserTableFilters: React.FC<UserTableFiltersProps> = ({
  searchQuery,
  statusFilter,
  isRefreshing,
  onSearchChange,
  onStatusChange,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b p-4">
      <div className="relative flex-1 w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, username or email..."
          className="pl-9 w-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          className="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <Button variant="outline" size="icon" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
