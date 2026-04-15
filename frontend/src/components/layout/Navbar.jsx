import { useAuth } from "../../context/AuthContext";
import { Menu } from "lucide-react";

export function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-surface-lighter bg-surface/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-100 md:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-surface-lighter md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Profile dropdown Placeholder */}
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden lg:block text-sm font-medium leading-6 text-gray-100">
              {user?.username}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
