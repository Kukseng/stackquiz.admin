import AnalyticsComponent from '@/components/anlytics/analytics'
import { DashboardLayout } from '@/components/DashboardLayout'
import React from 'react'

export default function Analytics() {
  return (
    <DashboardLayout currentPage="analytics">
      <AnalyticsComponent/>
    </DashboardLayout>
  )
}
