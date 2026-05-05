import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  UserCog,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/auth-slice";
import { Sheet } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { fetchCartItems } from "../../store/shop/cart-slice/index";
import CartWrapper from "./CartWrapper";

const avatarThemes = [
  "bg-white text-red-600",
  "bg-red-100 text-red-700",
  "bg-amber-100 text-amber-700",
  "bg-orange-100 text-orange-700",
  "bg-rose-100 text-rose-700",
];

const searchCategoryOptions = [
  { value: "", label: "All Categories" },
  { value: "Laptop", label: "Laptops" },
  { value: "Lcd", label: "Monitors" },
  { value: "Printer", label: "Printers" },
  { value: "HDD", label: "HDD" },
  { value: "Ink", label: "Ink" },
  { value: "Network", label: "Network" },
  { value: "All In One", label: "All-in-One" },
  { value: "Towner", label: "Toners" },
];

const getUserDisplayName = (user) =>
  user?.userName || user?.username || user?.name || user?.email || "User";

const getUserInitials = (displayName) => {
  return displayName.trim().charAt(0).toUpperCase() || "U";
};

const getAvatarTheme = (seed) => {
  const total = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarThemes[total % avatarThemes.length];
};

function ShoppingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSearchCategory, setSelectedSearchCategory] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = `${location.pathname}${location.search}`;

  const dispatch = useDispatch();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const { cartItems } = useSelector((state) => state.cart || { items: [] });
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const userId = user?.id || user?._id;

  const totalCartItems =
    cartItems?.items?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
    setSelectedSearchCategory(params.get("category") || "");
  }, [location.search]);

  const handleLogout = () => dispatch(logoutUser());

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const nextSearchTerm = searchTerm.trim();
    const params = new URLSearchParams();

    if (nextSearchTerm) {
      params.set("search", nextSearchTerm);
    }

    if (selectedSearchCategory) {
      params.set("category", selectedSearchCategory);
    }

    const queryString = params.toString();

    if (!queryString) {
      navigate("/shop/listing");
      setMenuOpen(false);
      return;
    }

    navigate(`/shop/listing?${queryString}`);
    setMenuOpen(false);
  };

  const userName = getUserDisplayName(user);
  const userInitials = getUserInitials(userName);
  const avatarTheme = getAvatarTheme(userName);

  const links = [
    { to: "/shop/home", label: "HOME" },
    { to: "/shop/listing", label: "PRODUCTS" },
    { to: "/shop/listing?category=Laptop", label: "LAPTOPS" },
    { to: "/shop/listing?category=Lcd", label: "MONITOR" },
    { to: "/shop/listing?category=Printer", label: "PRINTER" },
    { to: "/shop/listing?category=HDD", label: "HDD" },
    { to: "/shop/listing?category=Ink", label: "INK" },
    { to: "/shop/listing?category=Network", label: "NETWORK" },
    { to: "/shop/listing?category=All%20In%20One", label: "ALL-IN-ONE" },
    { to: "/shop/listing?category=Towner", label: "TONERS" },
    { to: "/shop/contact", label: "CONTACT" },
  ];

  const getIsActiveLink = (to, isActive) => {
    const isExactActive = currentPath === to;
    return to.includes("?") || to === "/shop/listing" ? isExactActive : isActive;
  };

  const userMenu = (avatarClassName = "") => {
    if (!isAuthenticated) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className={`cursor-pointer shadow-md transition-transform hover:scale-105 ${avatarClassName}`}>
            <AvatarFallback className={`font-black uppercase ${avatarTheme}`}>
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-56">
          <DropdownMenuLabel>Welcome, {userName}!</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <UserCog className="mr-2 h-4 w-4" /> Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
      <nav className="w-full overflow-x-hidden bg-red-600 shadow-lg">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_34%),linear-gradient(145deg,#dc2626_0%,#991b1b_58%,#1f0808_100%)] px-4 pb-4 pt-3 text-white lg:hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-red-100">
                Alam Computer
              </p>
              <h1 className="mt-1 text-2xl font-black uppercase leading-none tracking-tighter">
                Tech Store
              </h1>
              <p className="mt-1 text-xs font-semibold text-red-100">
                Laptops, parts, printers and network gear.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setOpenCartSheet(true)}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-black text-red-600 shadow-md">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {userMenu("h-11 w-11 border-2 border-white/25")}

              <button
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/20 text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-black/30"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-4 rounded-[26px] border border-white/20 bg-white p-2 text-gray-900 shadow-[0_18px_45px_rgba(69,10,10,0.26)]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-2xl bg-red-50 px-3">
                <Search className="h-4 w-4 shrink-0 text-red-600" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="h-11 rounded-2xl bg-red-600 px-4 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-700"
              >
                Go
              </button>
            </div>

            <select
              value={selectedSearchCategory}
              onChange={(event) => setSelectedSearchCategory(event.target.value)}
              className="mt-2 h-10 w-full rounded-2xl border border-red-100 bg-white px-3 text-xs font-bold uppercase tracking-[0.14em] text-gray-600 outline-none"
              aria-label="Search category"
            >
              {searchCategoryOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </form>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {links.slice(0, 5).map(({ to, label }) => (
              <NavLink
                key={`quick-${to}`}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => {
                  const shouldShowActive = getIsActiveLink(to, isActive);

                  return `shrink-0 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] shadow-sm transition ${
                    shouldShowActive
                      ? "bg-white text-red-600"
                      : "bg-white/12 text-white ring-1 ring-white/15 hover:bg-white/20"
                  }`;
                }}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {menuOpen && (
            <div className="mt-3 rounded-[28px] border border-white/15 bg-white/10 p-3 shadow-inner backdrop-blur">
              <p className="px-1 text-[10px] font-black uppercase tracking-[0.28em] text-red-100">
                Browse Categories
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {links.map(({ to, label }) => (
                  <NavLink
                    key={`mobile-${to}`}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => {
                      const shouldShowActive = getIsActiveLink(to, isActive);

                      return `rounded-2xl px-3 py-3 text-center text-[11px] font-black uppercase tracking-[0.14em] transition ${
                        shouldShowActive
                          ? "bg-white text-red-600 shadow-md"
                          : "bg-black/15 text-white ring-1 ring-white/10 hover:bg-white/15"
                      }`;
                    }}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="flex flex-wrap items-center justify-between px-4 py-4 md:px-16">
            <p className="text-2xl font-bold tracking-tighter text-white md:text-4xl">
              ALAM COMPUTER
            </p>

            <div className="flex items-center gap-3 md:gap-5">
              <form
                onSubmit={handleSearchSubmit}
                className="flex h-9 overflow-hidden rounded-md bg-white shadow-inner md:h-10"
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search components..."
                  className="w-32 px-3 text-sm focus:outline-none md:w-64"
                />
                <select
                  value={selectedSearchCategory}
                  onChange={(event) => setSelectedSearchCategory(event.target.value)}
                  className="w-28 border-l bg-white px-2 text-xs font-medium text-gray-600 outline-none md:w-40 md:text-sm"
                  aria-label="Search category"
                >
                  {searchCategoryOptions.map((option) => (
                    <option key={option.value || "all"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  aria-label="Search products"
                  className="flex cursor-pointer items-center border-l bg-gray-50 px-3 transition-colors hover:bg-gray-100"
                >
                  <Search className="h-5 w-5 text-gray-700" />
                </button>
              </form>

              <button
                onClick={() => setOpenCartSheet(true)}
                className="relative flex items-center justify-center rounded-full p-2 transition-all hover:bg-red-700 focus:outline-none"
              >
                <ShoppingCart className="h-7 w-7 text-white md:h-8 md:w-8" />
                <span className="ml-2 hidden text-xs font-bold uppercase text-white md:block">
                  Cart
                </span>

                {totalCartItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-black text-red-600 shadow-md">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {userMenu("border-2 border-red-300")}
            </div>
          </div>

          <div className="flex flex-row space-x-4 border-t border-red-500 px-20 py-4">
            {links.map(({ to, label }) => (
              <NavLink
                key={`desktop-${to}`}
                to={to}
                className={({ isActive }) => {
                  const shouldShowActive = getIsActiveLink(to, isActive);

                  return `rounded px-3 py-2 text-sm font-semibold transition-all ${
                    shouldShowActive
                      ? "bg-white text-red-600 shadow-md"
                      : "text-white hover:bg-red-500"
                  }`;
                }}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <CartWrapper
        setOpenCartSheet={setOpenCartSheet}
        cartItems={cartItems?.items || []}
      />
    </Sheet>
  );
}

export default ShoppingHeader;
