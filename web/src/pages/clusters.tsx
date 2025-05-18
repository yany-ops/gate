import { Button } from "@/components/ui/button";
import { ClusterList } from "@/components/cluster-list";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";

export default function ClustersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Kubernetes Clusters
        </h1>
        <Link to="/dashboard/clusters/add">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Cluster
          </Button>
        </Link>
      </div>

      <ClusterList />
    </div>
  );
}
