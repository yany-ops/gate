import { useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Terminal,
  XCircle,
} from "lucide-react";
import { ClusterRbacTable } from "@/components/cluster-rbac-table";
import { ClusterResourcesTable } from "@/components/cluster-resources-table";

const ClusterDetailsPage = () => {
  const params = useParams();
  const clusterId = params.id as string;
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data based on cluster ID
  const clusterData = {
    "prod-cluster-1": {
      name: "Production Cluster",
      status: "Connected",
      environment: "Production",
      version: "1.26.5",
      nodes: 5,
      region: "us-west-2",
      lastChecked: "2 minutes ago",
    },
    "staging-cluster-1": {
      name: "Staging Cluster",
      status: "Connected",
      environment: "Staging",
      version: "1.25.9",
      nodes: 3,
      region: "us-east-1",
      lastChecked: "5 minutes ago",
    },
    "dev-cluster-1": {
      name: "Development Cluster",
      status: "Disconnected",
      environment: "Development",
      version: "1.27.1",
      nodes: 2,
      region: "eu-west-1",
      lastChecked: "1 hour ago",
    },
  }[clusterId] || {
    name: "Unknown Cluster",
    status: "Unknown",
    environment: "Unknown",
    version: "Unknown",
    nodes: 0,
    region: "Unknown",
    lastChecked: "Unknown",
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/dashboard/clusters">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {clusterData.name}
        </h1>
        <Badge
          variant={
            clusterData.status === "Connected" ? "default" : "destructive"
          }
          className="ml-2"
        >
          {clusterData.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Kubernetes Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusterData.version}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusterData.nodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusterData.region}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Checked</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>{clusterData.lastChecked}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rbac">RBAC Configuration</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Cluster Overview</CardTitle>
                  <CardDescription>
                    Details and status of your Kubernetes cluster
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Cluster Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">Name:</div>
                          <div>{clusterData.name}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">
                            Environment:
                          </div>
                          <div>{clusterData.environment}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">Status:</div>
                          <div className="flex items-center">
                            {clusterData.status === "Connected" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                Connected
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                Disconnected
                              </>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">
                            API Server:
                          </div>
                          <div>https://k8s-{clusterId}.example.com:6443</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Access Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">
                            Access Method:
                          </div>
                          <div>Proxy</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">
                            Authentication:
                          </div>
                          <div>Service Account Token</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">
                            Users with Access:
                          </div>
                          <div>8 users</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">
                            RBAC Policies:
                          </div>
                          <div>5 policies</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                      {isRefreshing ? "Refreshing..." : "Refresh Status"}
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Kubeconfig
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Terminal className="h-4 w-4" />
                      Open Terminal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="rbac">
              <ClusterRbacTable clusterId={clusterId} />
            </TabsContent>
            <TabsContent value="resources">
              <ClusterResourcesTable clusterId={clusterId} />
            </TabsContent>
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Cluster Logs</CardTitle>
                  <CardDescription>
                    Recent activity and system logs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-md h-80 overflow-y-auto">
                    <div>
                      [2023-05-18 14:22:33] INFO: Cluster connection established
                    </div>
                    <div>
                      [2023-05-18 14:22:35] INFO: Authenticated as
                      system:serviceaccount:kube-system:proxy-sa
                    </div>
                    <div>
                      [2023-05-18 14:22:36] INFO: RBAC policies synchronized
                    </div>
                    <div>
                      [2023-05-18 14:25:12] INFO: User admin@example.com
                      connected
                    </div>
                    <div>
                      [2023-05-18 14:26:45] INFO: Namespace monitoring created
                    </div>
                    <div>
                      [2023-05-18 14:30:22] WARN: High CPU usage detected on
                      node-2
                    </div>
                    <div>
                      [2023-05-18 14:35:18] INFO: Deployment api-gateway updated
                      (replicas: 3)
                    </div>
                    <div>
                      [2023-05-18 14:40:05] INFO: User dev@example.com connected
                    </div>
                    <div>
                      [2023-05-18 14:42:33] INFO: Service backend-api created in
                      namespace default
                    </div>
                    <div>
                      [2023-05-18 14:45:12] INFO: Ingress frontend updated in
                      namespace default
                    </div>
                    <div>
                      [2023-05-18 14:50:28] INFO: ConfigMap app-config updated
                      in namespace default
                    </div>
                    <div>
                      [2023-05-18 14:55:33] INFO: Secret db-credentials created
                      in namespace database
                    </div>
                    <div>
                      [2023-05-18 15:00:45] INFO: Scheduled health check
                      completed successfully
                    </div>
                    <div>
                      [2023-05-18 15:05:22] INFO: User admin@example.com
                      disconnected
                    </div>
                    <div>
                      [2023-05-18 15:10:18] INFO: Metrics collection completed
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ClusterDetailsPage;
