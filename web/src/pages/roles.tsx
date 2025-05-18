import { RolesTable } from "@/components/rbac/roles-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground mt-2">
            Manage roles and their permissions
          </p>
        </div>
        <Link to="/dashboard/rbac/roles/add">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Role
          </Button>
        </Link>
      </div>

      <RolesTable />
    </div>
  );
}
