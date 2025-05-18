import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Link } from "react-router"

// Mock data for RBAC policies
const rbacPolicies = {
  "prod-cluster-1": [
    {
      id: "admin-policy",
      name: "Cluster Admin",
      description: "Full administrative access to all resources",
      role: "admin",
      namespaces: "All",
      users: 2,
    },
    {
      id: "dev-policy",
      name: "Developer Access",
      description: "Edit access to development namespaces",
      role: "edit",
      namespaces: "default, dev, apps",
      users: 5,
    },
    {
      id: "readonly-policy",
      name: "Read Only",
      description: "View-only access to all resources",
      role: "view",
      namespaces: "All",
      users: 8,
    },
    {
      id: "ops-policy",
      name: "Operations",
      description: "Edit access to monitoring and logging",
      role: "custom",
      namespaces: "monitoring, logging",
      users: 3,
    },
  ],
  "staging-cluster-1": [
    {
      id: "admin-policy",
      name: "Cluster Admin",
      description: "Full administrative access to all resources",
      role: "admin",
      namespaces: "All",
      users: 2,
    },
    {
      id: "dev-policy",
      name: "Developer Access",
      description: "Edit access to development namespaces",
      role: "edit",
      namespaces: "default, dev, apps",
      users: 5,
    },
  ],
  "dev-cluster-1": [
    {
      id: "admin-policy",
      name: "Cluster Admin",
      description: "Full administrative access to all resources",
      role: "admin",
      namespaces: "All",
      users: 2,
    },
  ],
}

interface ClusterRbacTableProps {
  clusterId: string
}

export function ClusterRbacTable({ clusterId }: ClusterRbacTableProps) {
  const policies = rbacPolicies[clusterId as keyof typeof rbacPolicies] || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>RBAC Configuration</CardTitle>
          <CardDescription>Manage role-based access control for this cluster</CardDescription>
        </div>
        <Link to="/dashboard/rbac/add-policy" className="ml-auto">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Policy
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <div className="grid grid-cols-6 gap-4 p-4 border-b font-medium text-sm">
            <div>Name</div>
            <div className="col-span-2">Description</div>
            <div>Role</div>
            <div>Namespaces</div>
            <div>Users</div>
          </div>
          {policies.length > 0 ? (
            policies.map((policy) => (
              <div key={policy.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center text-sm">
                <div className="font-medium">{policy.name}</div>
                <div className="col-span-2 text-muted-foreground">{policy.description}</div>
                <div>
                  <Badge
                    variant={
                      policy.role === "admin"
                        ? "destructive"
                        : policy.role === "edit"
                          ? "default"
                          : policy.role === "view"
                            ? "secondary"
                            : "outline"
                    }
                  >
                    {policy.role}
                  </Badge>
                </div>
                <div className="text-muted-foreground">{policy.namespaces}</div>
                <div className="flex items-center justify-between">
                  <span>{policy.users}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Policy</DropdownMenuItem>
                      <DropdownMenuItem>View Users</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Policy</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No RBAC policies configured for this cluster</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
