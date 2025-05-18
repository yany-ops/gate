import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, RefreshCw, Search } from "lucide-react"

// Mock data for cluster resources
const resources = {
  "prod-cluster-1": [
    {
      id: "1",
      name: "api-gateway",
      kind: "Deployment",
      namespace: "default",
      status: "Running",
      age: "10d",
      pods: "3/3",
    },
    {
      id: "2",
      name: "frontend",
      kind: "Deployment",
      namespace: "default",
      status: "Running",
      age: "10d",
      pods: "2/2",
    },
    {
      id: "3",
      name: "database",
      kind: "StatefulSet",
      namespace: "database",
      status: "Running",
      age: "10d",
      pods: "3/3",
    },
    {
      id: "4",
      name: "prometheus",
      kind: "Deployment",
      namespace: "monitoring",
      status: "Running",
      age: "5d",
      pods: "1/1",
    },
    {
      id: "5",
      name: "grafana",
      kind: "Deployment",
      namespace: "monitoring",
      status: "Running",
      age: "5d",
      pods: "1/1",
    },
  ],
  "staging-cluster-1": [
    {
      id: "1",
      name: "api-gateway",
      kind: "Deployment",
      namespace: "default",
      status: "Running",
      age: "3d",
      pods: "2/2",
    },
    {
      id: "2",
      name: "frontend",
      kind: "Deployment",
      namespace: "default",
      status: "Running",
      age: "3d",
      pods: "1/1",
    },
  ],
  "dev-cluster-1": [
    {
      id: "1",
      name: "api-gateway",
      kind: "Deployment",
      namespace: "default",
      status: "Failed",
      age: "1d",
      pods: "0/1",
    },
  ],
}

interface ClusterResourcesTableProps {
  clusterId: string
}

export function ClusterResourcesTable({ clusterId }: ClusterResourcesTableProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const clusterResources = resources[clusterId as keyof typeof resources] || []

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Cluster Resources</CardTitle>
          <CardDescription>View and manage resources in this cluster</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search resources..." className="pl-8 w-[250px]" />
          </div>
          <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <div className="grid grid-cols-7 gap-4 p-4 border-b font-medium text-sm">
            <div>Name</div>
            <div>Kind</div>
            <div>Namespace</div>
            <div>Status</div>
            <div>Pods</div>
            <div>Age</div>
            <div></div>
          </div>
          {clusterResources.length > 0 ? (
            clusterResources.map((resource) => (
              <div key={resource.id} className="grid grid-cols-7 gap-4 p-4 border-b last:border-0 items-center text-sm">
                <div className="font-medium">{resource.name}</div>
                <div>{resource.kind}</div>
                <div>{resource.namespace}</div>
                <div>
                  <Badge variant={resource.status === "Running" ? "default" : "destructive"}>{resource.status}</Badge>
                </div>
                <div>{resource.pods}</div>
                <div>{resource.age}</div>
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>View Logs</DropdownMenuItem>
                      <DropdownMenuItem>Edit YAML</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No resources found in this cluster</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
