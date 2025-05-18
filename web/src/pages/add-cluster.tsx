import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload } from "lucide-react"
import { Link } from "react-router"

export default function AddClusterPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate adding a cluster
    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard/clusters")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/dashboard/clusters">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add Kubernetes Cluster</h1>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Cluster Configuration</CardTitle>
          <CardDescription>Connect a new Kubernetes cluster to your proxy management system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Configuration</TabsTrigger>
              <TabsTrigger value="kubeconfig">Upload Kubeconfig</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Cluster Name</Label>
                      <Input id="name" placeholder="production-cluster" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="environment">Environment</Label>
                      <Select>
                        <SelectTrigger id="environment">
                          <SelectValue placeholder="Select environment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-server">API Server URL</Label>
                    <Input id="api-server" placeholder="https://kubernetes.example.com:6443" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ca-cert">CA Certificate</Label>
                    <Textarea id="ca-cert" placeholder="-----BEGIN CERTIFICATE-----..." rows={4} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="auth-type">Authentication Type</Label>
                      <Select>
                        <SelectTrigger id="auth-type">
                          <SelectValue placeholder="Select auth type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="token">Service Account Token</SelectItem>
                          <SelectItem value="cert">Client Certificate</SelectItem>
                          <SelectItem value="oidc">OIDC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="token">Service Account Token</Label>
                      <Input id="token" type="password" placeholder="eyJhbGciOiJSUzI1NiIs..." />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link to="/dashboard/clusters">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Cluster"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="kubeconfig">
              <div className="pt-6 space-y-6">
                <div className="border-2 border-dashed rounded-lg p-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <h3 className="font-medium text-lg">Upload Kubeconfig File</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Drag and drop your kubeconfig file here, or click to browse
                    </p>
                    <Button variant="outline" className="mt-2">
                      Select File
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link to="/dashboard/clusters">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button disabled>Upload and Connect</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
