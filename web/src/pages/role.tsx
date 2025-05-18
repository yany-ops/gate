import { useParams, useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { RoleAssignmentsTable } from "@/components/rbac/role-assignments-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RoleDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const roleId = params.id as string;

  // Mock data for the role
  const roleData = {
    name: "Developer Role",
    description: "Role for developers with access to development resources",
    userCount: 5,
    groupCount: 2,
  };

  // Mock data for permissions
  const permissions = [
    {
      id: "1",
      resources: ["pods", "deployments", "services", "configmaps"],
      actions: ["get", "list", "watch", "create", "update"],
      clusters: ["Staging Cluster", "Development Cluster"],
    },
  ];

  const handleDelete = () => {
    // Simulate deleting a role
    setTimeout(() => {
      navigate("/dashboard/rbac/roles");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard/rbac">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{roleData.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/dashboard/rbac/roles/${roleId}/edit`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Role
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the role "{roleData.name}" and
                  remove all permissions associated with it. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
          <CardDescription>{roleData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Users
              </div>
              <Badge variant="outline">{roleData.userCount} users</Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Groups
              </div>
              <Badge variant="outline">{roleData.groupCount} groups</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissions</h3>
            <div className="border rounded-md">
              <div className="grid grid-cols-3 gap-4 p-4 border-b font-medium text-sm">
                <div>Resources</div>
                <div>Actions</div>
                <div>Clusters</div>
              </div>
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="grid grid-cols-3 gap-4 p-4 border-b last:border-0 items-center text-sm"
                >
                  <div>
                    {permission.resources.map((resource, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className={i > 0 ? "ml-1 mt-1" : "mt-1"}
                      >
                        {resource}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    {permission.actions.map((action, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className={i > 0 ? "ml-1 mt-1" : "mt-1"}
                      >
                        {action}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    {permission.clusters.map((cluster, i) => (
                      <Badge
                        key={i}
                        variant="default"
                        className={i > 0 ? "ml-1 mt-1" : "mt-1"}
                      >
                        {cluster}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <RoleAssignmentsTable roleId={roleId} />
    </div>
  );
}
