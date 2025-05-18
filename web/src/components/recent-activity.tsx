import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

// Mock data for recent activity
const activities = [
  {
    id: 1,
    user: {
      name: "Admin",
      email: "admin@example.com",
      avatar: "/abstract-geometric-shapes.png",
    },
    action: "added a new cluster",
    target: "Production Cluster",
    time: "10 minutes ago",
  },
  {
    id: 2,
    user: {
      name: "Developer",
      email: "dev@example.com",
      avatar: "/developer-working.png",
    },
    action: "updated RBAC policy",
    target: "developer-readonly",
    time: "1 hour ago",
  },
  {
    id: 3,
    user: {
      name: "Operations",
      email: "ops@example.com",
      avatar: "/operations-management.png",
    },
    action: "connected to terminal",
    target: "Staging Cluster",
    time: "2 hours ago",
  },
  {
    id: 4,
    user: {
      name: "Admin",
      email: "admin@example.com",
      avatar: "/abstract-geometric-shapes.png",
    },
    action: "added a new user",
    target: "dev@example.com",
    time: "3 hours ago",
  },
  {
    id: 5,
    user: {
      name: "System",
      email: "system@example.com",
      avatar: "/interconnected-system.png",
    },
    action: "detected connection issue",
    target: "Development Cluster",
    time: "5 hours ago",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={activity.user.avatar || "/placeholder.svg"}
                alt={activity.user.name}
              />
              <AvatarFallback>
                {activity.user.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-medium">{activity.user.name}</span>
                <span>{activity.action}</span>
                <span className="font-medium">{activity.target}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {activity.time}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
