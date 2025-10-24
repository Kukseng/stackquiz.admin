
"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import OverviewComponent from '@/components/overview/overview';
export default function DashboardPage() {
  return(
       <DashboardLayout currentPage="dashboard">
        <OverviewComponent />
      </DashboardLayout>
  )
}