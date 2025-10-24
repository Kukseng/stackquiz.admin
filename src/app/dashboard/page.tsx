
"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import OverviewComponent from '@/components/overview/overview';
import { Search, Calendar, Bell, Settings } from "lucide-react";
export default function DashboardPage() {
  return(
       <DashboardLayout currentPage="dashboard">
        <OverviewComponent />
      </DashboardLayout>
  )
}