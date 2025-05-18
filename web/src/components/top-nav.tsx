import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="border-b h-16 flex items-center px-6 gap-4">
      {searchOpen ? (
        <div className="flex-1 flex items-center">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            className="flex-1"
            placeholder="Search clusters, resources, users..."
            autoFocus
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex items-center h-9 w-full max-w-sm rounded-md border px-3">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Search clusters, resources, users..."
            />
          </div>
        </>
      )}

      <div className="flex items-center ml-auto gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-2">
                <div className="font-medium">Cluster Connection Issue</div>
                <div className="text-sm text-muted-foreground">
                  Development Cluster is disconnected
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  10 minutes ago
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-2">
                <div className="font-medium">New User Added</div>
                <div className="text-sm text-muted-foreground">
                  User dev@example.com was added to the system
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  1 hour ago
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-2">
                <div className="font-medium">RBAC Policy Updated</div>
                <div className="text-sm text-muted-foreground">
                  The developer-readonly policy was updated
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  2 hours ago
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
