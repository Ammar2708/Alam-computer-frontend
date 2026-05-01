import {
  AlignJustify,
  Bell,
  LogOut,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../store/auth-slice";

function Header({ setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/auth/login");
    });
  }

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div className="flex items-center justify-between gap-3 rounded-3xl border border-gray-200 bg-white px-3 py-3 shadow-sm backdrop-blur sm:px-5 sm:py-4">

        {/* LEFT SECTION */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

          {/* Mobile Menu */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen?.(true)}
            className="rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <AlignJustify className="h-5 w-5" />
          </Button>

          {/* Logo + Title */}
          <div className="flex items-center gap-3">

            <div className="flex shrink-0 items-center justify-center">
              <img src="/logo1.webp" className="h-11 w-12 rounded-xl sm:h-14 sm:w-15" />
            </div>

            <div className="min-w-0 leading-tight">
              <p className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500 min-[420px]:block">
                Admin Panel
              </p>

              <h1 className="hidden truncate text-base font-semibold text-gray-800 min-[420px]:block sm:text-lg">
                Store Control Center
              </h1>
            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          {/* Search */}
          <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 md:flex">

            <Search className="h-4 w-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search products, orders..."
              className="bg-transparent text-sm outline-none placeholder:text-gray-400"
            />

          </div>

          {/* Notification */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* Admin Profile */}
          <div className="hidden items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-1.5 sm:flex">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-semibold text-white">
              A
            </div>

            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-800">
                Admin
              </p>

              <p className="text-xs text-gray-500">
                Management Access
              </p>
            </div>

          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 sm:px-4"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>

        </div>

      </div>
    </header>
  );
}

export default Header;
