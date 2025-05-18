import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, Search, UserMinus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Mock data for users assigned to a role
const roleUsers = {
  "1": [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      lastActive: "10 minutes ago",
      avatar: "/admin-interface.png",
    },
    {
      id: "5",
      name: "System Admin",
      email: "sysadmin@example.com",
      lastActive: "1 day ago",
      avatar: "/placeholder.svg",
    },
  ],
  "2": [
    {
      id: "2",
      name: "Developer One",
      email: "dev1@example.com",
      lastActive: "1 hour ago",
      avatar: "/developer-working.png",
    },
    {
      id: "3",
      name: "Developer Two",
      email: "dev2@example.com",
      lastActive: "3 hours ago",
      avatar: "/placeholder-kkat9.png",
    },
    {
      id: "6",
      name: "Developer Three",
      email: "dev3@example.com",
      lastActive: "2 days ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "7",
      name: "Developer Four",
      email: "dev4@example.com",
      lastActive: "5 days ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "8",
      name: "Developer Five",
      email: "dev5@example.com",
      lastActive: "1 week ago",
      avatar: "/placeholder.svg",
    },
  ],
  "3": [
    {
      id: "4",
      name: "Operations User",
      email: "ops@example.com",
      lastActive: "2 days ago",
      avatar: "/operations-management.png",
    },
    {
      id: "9",
      name: "Operations Two",
      email: "ops2@example.com",
      lastActive: "3 days ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "10",
      name: "Operations Three",
      email: "ops3@example.com",
      lastActive: "1 week ago",
      avatar: "/placeholder.svg",
    },
  ],
  "4": [
    {
      id: "11",
      name: "Viewer One",
      email: "viewer1@example.com",
      lastActive: "1 day ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "12",
      name: "Viewer Two",
      email: "viewer2@example.com",
      lastActive: "3 days ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "13",
      name: "Viewer Three",
      email: "viewer3@example.com",
      lastActive: "1 week ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "14",
      name: "Viewer Four",
      email: "viewer4@example.com",
      lastActive: "2 weeks ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "15",
      name: "Viewer Five",
      email: "viewer5@example.com",
      lastActive: "3 weeks ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "16",
      name: "Viewer Six",
      email: "viewer6@example.com",
      lastActive: "1 month ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "17",
      name: "Viewer Seven",
      email: "viewer7@example.com",
      lastActive: "2 months ago",
      avatar: "/placeholder.svg",
    },
    {
      id: "18",
      name: "Viewer Eight",
      email: "viewer8@example.com",
      lastActive: "3 months ago",
      avatar: "/placeholder.svg",
    },
  ],
}

// Mock data for groups assigned to a role
const roleGroups = {
  "1": [
    {
      id: "1",
      name: "Administrators",
      description: "Full access to all resources",
      users: 2,
    },
  ],
  "2": [
    {
      id: "2",
      name: "Developers",
      description: "Development team with access to development resources",
      users: 5,
    },
    {
      id: "3",
      name: "Operations",
      description: "Operations team with monitoring and deployment access",
      users: 3,
    },
  ],
  "3": [
    {
      id: "3",
      name: "Operations",
      description: "Operations team with monitoring and deployment access",
      users: 3,
    },
  ],
  "4": [
    {
      id: "2",
      name: "Developers",
      description: "Development team with access to development resources",
      users: 5,
    },
    {
      id: "4",
      name: "Viewers",
      description: "Read-only access to resources",
      users: 8,
    },
  ],
}

// Mock data for available users to add to a role
const availableUsers = [
  {
    id: "19",
    name: "New User One",
    email: "newuser1@example.com",
    avatar: "/placeholder.svg",
  },
  {
    id: "20",
    name: "New User Two",
    email: "newuser2@example.com",
    avatar: "/placeholder.svg",
  },
  {
    id: "21",
    name: "New User Three",
    email: "newuser3@example.com",
    avatar: "/placeholder.svg",
  },
]

// Mock data for available groups to add to a role
const availableGroups = [
  {
    id: "5",
    name: "CI/CD",
    description: "Access for CI/CD pipelines",
  },
  {
    id: "6",
    name: "QA Team",
    description: "Quality Assurance team",
  },
  {
    id: "7",
    name: "Security Team",
    description: "Security team with audit access",
  },
]

interface RoleAssignmentsTableProps {
  roleId: string
}

export function RoleAssignmentsTable({ roleId }: RoleAssignmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("users")

  const users = roleUsers[roleId as keyof typeof roleUsers] || []
  const groups = roleGroups[roleId as keyof typeof roleGroups] || []

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Role Assignments</CardTitle>
          <CardDescription>Users and groups assigned to this role</CardDescription>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={activeTab === "users" ? "default" : "outline"} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Users to Role</DialogTitle>
                <DialogDescription>
                  Select users to assign this role to. They will receive all permissions granted by this role.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search users..." className="pl-8" />
                </div>
                <div className="border rounded-md p-4 space-y-3 max-h-60 overflow-y-auto">
                  {availableUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox id={`user-${user.id}`} />
                      <Label htmlFor={`user-${user.id}`} className="font-normal flex-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex justify-between w-full">
                            <span>{user.name}</span>
                            <span className="text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddUserDialogOpen(false)}>Add Selected Users</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddGroupDialogOpen} onOpenChange={setIsAddGroupDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={activeTab === "groups" ? "default" : "outline"} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Groups to Role</DialogTitle>
                <DialogDescription>
                  Select groups to assign this role to. All users in these groups will receive the permissions granted
                  by this role.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search groups..." className="pl-8" />
                </div>
                <div className="border rounded-md p-4 space-y-3 max-h-60 overflow-y-auto">
                  {availableGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox id={`group-${group.id}`} />
                      <Label htmlFor={`group-${group.id}`} className="font-normal flex-1">
                        <div>
                          <div className="font-medium">{group.name}</div>
                          <div className="text-sm text-muted-foreground">{group.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddGroupDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddGroupDialogOpen(false)}>Add Selected Groups</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeTab}...`}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="users" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
              <TabsTrigger value="groups">Groups ({groups.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-4">
              <div className="border rounded-md">
                <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm">
                  <div className="col-span-2">User</div>
                  <div>Last Active</div>
                  <div></div>
                </div>
                {filteredUsers.map((user) => (
                  <div key={user.id} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0 items-center text-sm">
                    <div className="col-span-2 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-muted-foreground">{user.lastActive}</div>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View User</DropdownMenuItem>
                          <DropdownMenuItem>View Permissions</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove from Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">No users found</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="groups" className="mt-4">
              <div className="border rounded-md">
                <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm">
                  <div>Name</div>
                  <div className="col-span-2">Description</div>
                  <div></div>
                </div>
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="grid grid-cols-4 gap-4 p-4 border-b last:border-0 items-center text-sm"
                  >
                    <div className="font-medium">{group.name}</div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground">{group.description}</div>
                      <Badge variant="outline" className="mt-1">
                        {group.users} users
                      </Badge>
                    </div>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Group</DropdownMenuItem>
                          <DropdownMenuItem>View Users</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Remove from Role</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {filteredGroups.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">No groups found</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
