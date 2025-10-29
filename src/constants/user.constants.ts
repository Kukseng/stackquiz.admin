

export const USERS_PER_PAGE = 10;

export const STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const STATUS_FILTER_OPTIONS = [
  { value: STATUS_FILTERS.ALL, label: 'All Status' },
  { value: STATUS_FILTERS.ACTIVE, label: 'Active' },
  { value: STATUS_FILTERS.INACTIVE, label: 'Inactive' },
];
