import { DashboardLayout } from "@/components/DashboardLayout";
import ExploreComponent from "@/components/explore/Explore";

export default function ExplorePage(){
  return(
    <DashboardLayout currentPage="exploer">
      <ExploreComponent/>
    </DashboardLayout>
  )
}