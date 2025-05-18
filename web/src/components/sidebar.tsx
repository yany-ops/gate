import { useState } from "react";
import { Link } from "react-router";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Cog,
  Globe,
  Home,
  LockKeyhole,
  LogOut,
  Server,
  Shield,
  Terminal,
  Users,
} from "lucide-react";
import LogoIcon from "../assets/logo.png";

export function Sidebar() {
  const pathname = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path: string) => {
    return (
      pathname.pathname === path || pathname.pathname?.startsWith(`${path}/`)
    );
  };

  return (
    <div
      className={`border-r bg-background flex flex-col h-screen ${collapsed ? "w-16" : "w-64"} transition-all duration-300`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src={LogoIcon} alt="Logo" className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">GateProxy</span>
          </div>
        )}
        {collapsed && <Shield className="h-6 w-6 text-primary mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={collapsed ? "mx-auto" : ""}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Link to="/dashboard">
            <Button
              variant={
                isActive("/dashboard") &&
                !isActive("/dashboard/clusters") &&
                !isActive("/dashboard/rbac")
                  ? "secondary"
                  : "ghost"
              }
              className={`w-full justify-start ${collapsed ? "px-2" : "px-3"}`}
            >
              <Home className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-2"}`} />
              {!collapsed && <span>Dashboard</span>}
            </Button>
          </Link>
          <Link to="/dashboard/clusters">
            <Button
              variant={isActive("/dashboard/clusters") ? "secondary" : "ghost"}
              className={`w-full justify-start ${collapsed ? "px-2" : "px-3"}`}
            >
              <Server className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-2"}`} />
              {!collapsed && <span>Clusters</span>}
            </Button>
          </Link>
          <Link to="/dashboard/rbac">
            <Button
              variant={isActive("/dashboard/rbac") ? "secondary" : "ghost"}
              className={`w-full justify-start ${collapsed ? "px-2" : "px-3"}`}
            >
              <LockKeyhole
                className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-2"}`}
              />
              {!collapsed && <span>RBAC</span>}
            </Button>
          </Link>
          <Link to="#">
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : "px-3"}`}
            >
              <Users className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-2"}`} />
              {!collapsed && <span>Users</span>}
            </Button>
          </Link>
        </nav>
      </div>
      <div className="border-t p-2">
        <nav className="grid gap-1">
          <Link to="#">
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? "px-2" : "px-3"}`}
            >
              <Cog className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-2"}`} />
              {!collapsed && <span>Settings</span>}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className={`w-full justify-start ${collapsed ? "px-2" : "px-3"}`}
          >
            <LogOut className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-2"}`} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </nav>
      </div>
    </div>
  );
}
