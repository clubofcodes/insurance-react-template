import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Button } from "./ui/button";
import {
  Shield,
  Users,
  FileText,
  Building,
  UserCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = ({
  isOpen,
  onToggle,
  isMobile = false,
}: {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/dashboard",
      roles: ["master_admin", "agency_admin", "agent"],
    },
    {
      icon: FileText,
      label: "Quotes",
      path: "/quotes",
      roles: ["master_admin", "agency_admin", "agent"],
    },
    {
      icon: Building,
      label: "Agencies",
      path: "/agencies",
      roles: ["master_admin"],
    },
    {
      icon: UserCheck,
      label: "Agents",
      path: "/agents",
      roles: ["master_admin", "agency_admin"],
    },
    {
      icon: Users,
      label: "Customers",
      path: "/customers",
      roles: ["master_admin", "agency_admin", "agent"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => user?.role && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                InsureAdmin
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-6 space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      onToggle();
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Always visible user section and logout at bottom */}
          <div className="border-t bg-gray-50 p-4">
            {/* User info section */}
            {user ? (
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {user?.firstName?.[0] || "U"}
                    {user?.lastName?.[0] || "U"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize truncate">
                    {user?.role?.replace("_", " ")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm text-gray-500">No user logged in</p>
              </div>
            )}

            {/* Logout button - always visible */}
            <Button
              onClick={() => {
                console.log("Mobile logout button clicked"); // Debug log
                handleLogout();
                onToggle();
              }}
              variant="outline"
              size="sm"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-medium"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="flex flex-col w-full h-full bg-white shadow-lg">
      <div className="flex items-center h-16 px-6 border-b">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">InsureAdmin</span>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Desktop sidebar - always visible */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar isOpen={true} onToggle={() => {}} isMobile={false} />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={true}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar - visible on mobile */}
        <header className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => {
                console.log("Hamburger clicked, opening sidebar"); // Debug log
                setSidebarOpen(true);
              }}
              className="p-2 rounded-md hover:bg-gray-100 border border-gray-300"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">
                InsureAdmin
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
