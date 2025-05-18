import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RolesTable } from "@/components/rbac/roles-table"
import { RbacOverview } from "@/components/rbac/rbac-overview"

export default function RbacPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">RBAC Management</h1>
        <p className="text-muted-foreground mt-2">Manage role-based access control for your Kubernetes clusters</p>
      </div>

      <RbacOverview />

      <Card>
        <CardHeader>
          <CardTitle>Access Control Configuration</CardTitle>
          <CardDescription>Manage roles and their permissions for your Kubernetes clusters</CardDescription>
        </CardHeader>
        <CardContent>
          <RolesTable />
        </CardContent>
      </Card>
    </div>
  )
}
