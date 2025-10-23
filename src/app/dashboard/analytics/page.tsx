
"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import Analytics from '../analytics/page';

export default function DashboardPage() {
  return (
    <DashboardLayout currentPage="overview">
      <Analytics/>
    </DashboardLayout>
  );
}
