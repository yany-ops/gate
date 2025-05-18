import type { KeyboardEvent, FormEvent } from "react";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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

export default function EditRolePage() {
  const params = useParams();
  const navigate = useNavigate();
  const roleId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [groupInput, setGroupInput] = useState("");

  // Mock data for the role
  const roleData = {
    name: "Developer Role",
    description: "Role for developers with access to development resources",
  };

  // Mock data for clusters
  const availableClusters = [
    { id: "1", name: "Production Cluster", selected: false },
    { id: "2", name: "Staging Cluster", selected: true },
    { id: "3", name: "Development Cluster", selected: true },
  ];

  // Mock data for resources and actions
  const resources = [
    { name: "pods", selected: true },
    { name: "deployments", selected: true },
    { name: "services", selected: true },
    { name: "configmaps", selected: true },
    { name: "secrets", selected: false },
    { name: "namespaces", selected: false },
    { name: "nodes", selected: false },
  ];

  const actions = [
    { name: "get", selected: true },
    { name: "list", selected: true },
    { name: "watch", selected: true },
    { name: "create", selected: true },
    { name: "update", selected: true },
    { name: "patch", selected: false },
    { name: "delete", selected: false },
  ];

  // Initial users and groups
  const [users, setUsers] = useState<string[]>([
    "dev1@example.com",
    "dev2@example.com",
  ]);

  const [groups, setGroups] = useState<string[]>(["Developers"]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate updating a role
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/dashboard/rbac/roles/${roleId}`);
    }, 1500);
  };

  const handleDelete = () => {
    // Simulate deleting a role
    setTimeout(() => {
      navigate("/dashboard/rbac/roles");
    }, 1000);
  };

  const handleAddUser = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.trim()) {
      e.preventDefault();
      setUsers([...users, userInput.trim()]);
      setUserInput("");
    }
  };

  const handleAddGroup = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && groupInput.trim()) {
      e.preventDefault();
      setGroups([...groups, groupInput.trim()]);
      setGroupInput("");
    }
  };

  const removeUser = (user: string) => {
    setUsers(users.filter((u) => u !== user));
  };

  const removeGroup = (group: string) => {
    setGroups(groups.filter((g) => g !== group));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/rbac/roles/${roleId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit {roleData.name}
          </h1>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Role
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the role "{roleData.name}" and
                remove all permissions associated with it. This action cannot be
                undone.
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

      <Card>
        <CardHeader>
          <CardTitle>Role Details & Permissions</CardTitle>
          <CardDescription>
            Edit role information and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="role-details-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input id="name" defaultValue={roleData.name} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={roleData.description}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Apply to Clusters</Label>
                <Select defaultValue="specific">
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
                    <div
                      key={cluster.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`cluster-${cluster.id}`}
                        defaultChecked={cluster.selected}
                      />
                      <Label
                        htmlFor={`cluster-${cluster.id}`}
                        className="font-normal"
                      >
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
                          <div
                            key={resource.name}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`resource-${resource.name}`}
                              defaultChecked={resource.selected}
                            />
                            <Label
                              htmlFor={`resource-${resource.name}`}
                              className="font-normal"
                            >
                              {resource.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Actions</h4>
                      <div className="space-y-2">
                        {actions.map((action) => (
                          <div
                            key={action.name}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`action-${action.name}`}
                              defaultChecked={action.selected}
                            />
                            <Label
                              htmlFor={`action-${action.name}`}
                              className="font-normal"
                            >
                              {action.name}
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
                          setUsers([...users, userInput.trim()]);
                          setUserInput("");
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {users.map((user, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
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
                          setGroups([...groups, groupInput.trim()]);
                          setGroupInput("");
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {groups.map((group, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
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
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            form="role-details-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
