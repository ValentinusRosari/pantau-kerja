import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";
import { LayoutDashboard, Users, Clock, LogOut, X } from "lucide-react";

export function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Employees", href: "/admin/employees", icon: Users },
  ];

  const employeeLinks = [
    { name: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
    { name: "My History", href: "/employee/history", icon: Clock },
  ];

  const links = user?.role === "admin" ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex-col bg-surface-card border-r border-surface-lighter transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex",
          isOpen ? "translate-x-0 flex" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-surface-lighter">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Pantau<span className="text-primary-400">Kerja</span>
            </span>
          </div>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-4 pb-4">
          <div className="flex flex-col gap-1 flex-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-600/10 text-primary-400"
                      : "text-gray-400 hover:bg-surface-lighter hover:text-gray-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-primary-400" : "text-gray-400 group-hover:text-gray-100",
                    )}
                  />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mb-4 pt-4 border-t border-surface-lighter">
            <button
              onClick={logout}
              className="w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 group-hover:text-red-400" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
