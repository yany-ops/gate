import { useState } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, Search } from "lucide-react"

// Mock data for roles
const roles = [
  {
    id: "1",
    name: "Cluster Admin",
    description: "Full administrative access to all resources",
    permissions: 12,
    users: 2,
    groups: 1,
  },
  {
    id: "2",
    name: "Developer Role",
    description: "Role for developers with access to development resources",
    permissions: 8,
    users: 5,
    groups: 2,
  },
  {
    id: "3",
    name: "Operations Role",
    description: "Role for operations team with monitoring and deployment access",
    permissions: 10,
    users: 3,
    groups: 1,
  },
  {
    id: "4",
    name: "Viewer Role",
    description: "Read-only access to resources",
    permissions: 4,
    users: 8,
    groups: 2,
  },
]

export function RolesTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/dashboard/rbac/roles/add">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Role
          </Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-6 gap-4 p-4 border-b font-medium text-sm">
          <div>Name</div>
          <div className="col-span-2">Description</div>
          <div>Permissions</div>
          <div>Assignments</div>
          <div>Actions</div>
        </div>
        {filteredRoles.map((role) => (
          <div key={role.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center text-sm">
            <div className="font-medium">
              <Link to={`/dashboard/rbac/roles/${role.id}`} className="hover:underline">
                {role.name}
              </Link>
            </div>
            <div className="col-span-2 text-muted-foreground">{role.description}</div>
            <div>
              <Badge variant="secondary">{role.permissions} permissions</Badge>
            </div>
            <div>
              <Badge variant="outline">{role.users} users</Badge>
              <Badge variant="outline" className="ml-2">
                {role.groups} groups
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/dashboard/rbac/roles/${role.id}/edit`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/dashboard/rbac/roles/${role.id}`}>View Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/dashboard/rbac/roles/${role.id}/edit`}>Edit Role</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Clone Role</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete Role</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        {filteredRoles.length === 0 && <div className="p-4 text-center text-muted-foreground">No roles found</div>}
      </div>
    </div>
  )
}
