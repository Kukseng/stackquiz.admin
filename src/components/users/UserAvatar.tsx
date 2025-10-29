import React from 'react';

interface UserAvatarProps {
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  firstName,
  lastName,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
  };

  const initials = `${firstName?.[0]?.toUpperCase() || ''}${lastName?.[0]?.toUpperCase() || ''}`;

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${firstName} ${lastName}`}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <span className="text-primary font-semibold">{initials}</span>
      )}
    </div>
  );
};