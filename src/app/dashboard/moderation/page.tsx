"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ModerationTable } from '@/components/moderation/moderation-table';

export default function ModerationPage() {
  return (
    <DashboardLayout currentPage="moderation">
      <ModerationTable/>
    </DashboardLayout>
  );
}
