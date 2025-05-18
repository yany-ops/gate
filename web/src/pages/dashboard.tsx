import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClusterList } from "@/components/cluster-list";
import { RecentActivity } from "@/components/recent-activity";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link to="/dashboard/clusters/add">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Cluster
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Clusters</CardTitle>
            <CardDescription>Active Kubernetes clusters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Users with active sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>RBAC Policies</CardTitle>
            <CardDescription>Active access policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clusters">
        <TabsList>
          <TabsTrigger value="clusters">Clusters</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="clusters" className="mt-6">
          <ClusterList />
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
