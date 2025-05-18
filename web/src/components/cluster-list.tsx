import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Boxes,
  ChevronRight,
  Clock,
  MoreVertical,
  RefreshCw,
} from "lucide-react";

// Mock data for clusters
const clusters = [
  {
    id: "prod-cluster-1",
    name: "Production Cluster",
    status: "Connected",
    environment: "Production",
    version: "1.26.5",
    nodes: 5,
    region: "us-west-2",
    lastChecked: "2 minutes ago",
  },
  {
    id: "staging-cluster-1",
    name: "Staging Cluster",
    status: "Connected",
    environment: "Staging",
    version: "1.25.9",
    nodes: 3,
    region: "us-east-1",
    lastChecked: "5 minutes ago",
  },
  {
    id: "dev-cluster-1",
    name: "Development Cluster",
    status: "Disconnected",
    environment: "Development",
    version: "1.27.1",
    nodes: 2,
    region: "eu-west-1",
    lastChecked: "1 hour ago",
  },
];

export function ClusterList() {
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const handleRefresh = (id: string) => {
    setRefreshingId(id);
    setTimeout(() => setRefreshingId(null), 1500);
  };

  return (
    <div className="space-y-4">
      {clusters.map((cluster) => (
        <Card key={cluster.id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-full p-3">
                <Boxes className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg">{cluster.name}</h3>
                  <Badge
                    variant={
                      cluster.status === "Connected" ? "default" : "destructive"
                    }
                  >
                    {cluster.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {cluster.environment} • {cluster.version} • {cluster.nodes}{" "}
                  nodes • {cluster.region}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {cluster.lastChecked}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRefresh(cluster.id)}
                disabled={refreshingId === cluster.id}
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshingId === cluster.id ? "animate-spin" : ""}`}
                />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Cluster</DropdownMenuItem>
                  <DropdownMenuItem>Download Kubeconfig</DropdownMenuItem>
                  <DropdownMenuItem>View Logs</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Remove Cluster
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to={`/dashboard/clusters/${cluster.id}`}>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
