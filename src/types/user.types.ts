export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  profileUser?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateUserForm {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  profileUser: string;
}