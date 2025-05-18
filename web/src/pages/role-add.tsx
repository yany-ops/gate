import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Link } from "react-router"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function AddRolePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [groupInput, setGroupInput] = useState("")
  const [users, setUsers] = useState<string[]>([])
  const [groups, setGroups] = useState<string[]>([])

  // Mock data for clusters
  const availableClusters = [
    { id: "1", name: "Production Cluster" },
    { id: "2", name: "Staging Cluster" },
    { id: "3", name: "Development Cluster" },
  ]

  // Mock data for resources and actions
  const resources = ["pods", "deployments", "services", "configmaps", "secrets", "namespaces", "nodes"]
  const actions = ["get", "list", "watch", "create", "update", "patch", "delete"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate adding a role
    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard/rbac")
    }, 1500)
  }

  const handleAddUser = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.trim()) {
      e.preventDefault()
      setUsers([...users, userInput.trim()])
      setUserInput("")
    }
  }

  const handleAddGroup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && groupInput.trim()) {
      e.preventDefault()
      setGroups([...groups, groupInput.trim()])
      setGroupInput("")
    }
  }

  const removeUser = (user: string) => {
    setUsers(users.filter((u) => u !== user))
  }

  const removeGroup = (group: string) => {
    setGroups(groups.filter((g) => g !== group))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/dashboard/rbac">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Role</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Details & Permissions</CardTitle>
          <CardDescription>Define a new role with specific permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="role-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input id="name" placeholder="developer-role" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Role for developers with access to development resources"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Apply to Clusters</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select clusters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clusters</SelectItem>
                    <SelectItem value="specific">Specific Clusters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cluster Selection</Label>
                <div className="border rounded-md p-4 space-y-3">
                  {availableClusters.map((cluster) => (
                    <div key={cluster.id} className="flex items-center space-x-2">
                      <Checkbox id={`cluster-${cluster.id}`} />
                      <Label htmlFor={`cluster-${cluster.id}`} className="font-normal">
                        {cluster.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Resources</h4>
                      <div className="space-y-2">
                        {resources.map((resource) => (
                          <div key={resource} className="flex items-center space-x-2">
                            <Checkbox id={`resource-${resource}`} />
                            <Label htmlFor={`resource-${resource}`} className="font-normal">
                              {resource}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Actions</h4>
                      <div className="space-y-2">
                        {actions.map((action) => (
                          <div key={action} className="flex items-center space-x-2">
                            <Checkbox id={`action-${action}`} />
                            <Label htmlFor={`action-${action}`} className="font-normal">
                              {action}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assign to Users</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter email address and press Enter"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleAddUser}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => {
                        if (userInput.trim()) {
                          setUsers([...users, userInput.trim()])
                          setUserInput("")
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {users.map((user, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {user}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeUser(user)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assign to Groups</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter group name and press Enter"
                      value={groupInput}
                      onChange={(e) => setGroupInput(e.target.value)}
                      onKeyDown={handleAddGroup}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => {
                        if (groupInput.trim()) {
                          setGroups([...groups, groupInput.trim()])
                          setGroupInput("")
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {groups.map((group, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {group}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeGroup(group)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/dashboard/rbac">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" form="role-form" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Role"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
