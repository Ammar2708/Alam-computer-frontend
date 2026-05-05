import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Sparkles,
  Images,
  Settings,
} from "lucide-react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview and insights",
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: ShoppingBasket,
    description: "Catalog and inventory",
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: BadgeCheck,
    description: "Sales and fulfillment",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    description: "Checkout and delivery",
  },
  {
    id: "popup",
    label: "Popup",
    path: "/admin/popup",
    icon: Sparkles,
    description: "Manage homepage popup",
  },
  {
    id: "slider",
    label: "Slider",
    path: "/admin/slider",
    icon: Images,
    description: "Manage homepage slider",
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-4 flex flex-col gap-1.5">
      {adminSidebarMenuItems.map((menuItem) => {
        const Icon = menuItem.icon;
        const isActive = location.pathname === menuItem.path;

        return (
          <button
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen?.(false);
            }}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
              isActive
                ? "bg-red-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                isActive
                  ? "bg-white/20"
                  : "bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">{menuItem.label}</span>
              <span
                className={`text-[11px] ${
                  isActive ? "text-red-100" : "text-gray-400"
                }`}
              >
                {menuItem.description}
              </span>
            </div>

            {isActive && (
              <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function SidebarContent({ setOpen }) {
  const navigate = useNavigate();

  return (
    <div className="scrollbar-none flex h-full flex-col overflow-y-auto bg-white px-4 py-5">
      <div
        onClick={() => navigate("/admin/dashboard")}
        className="cursor-pointer rounded-2xl bg-red-600 p-3.5 text-white shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <ChartNoAxesCombined className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-red-100">
              Alam Computer
            </p>
            <h1 className="text-base font-semibold">Admin Panel</h1>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Navigation
          </p>
          <Sparkles className="h-4 w-4 text-red-500" />
        </div>

        <MenuItems setOpen={setOpen} />
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-gray-700">
              Admin Active
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-gray-500">
            Manage products, orders, popup, slider, and monitor store performance.
          </p>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ open, setOpen }) {
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[280px] border-r bg-white p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation</SheetTitle>
          </SheetHeader>

          <SidebarContent setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      <aside className="hidden w-[280px] shrink-0 border-r bg-white lg:block">
        <SidebarContent setOpen={setOpen} />
      </aside>
    </Fragment>
  );
}

export default Sidebar;
