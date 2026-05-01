import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function CheckAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);

  const isAuthPage =
    location.pathname.includes("/login") || location.pathname.includes("/register");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }

    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (isAuthenticated && isAuthPage) {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  if (isAuthenticated && user?.role === "admin" && location.pathname.includes("/shop")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("/admin")) {
    return <Navigate to="/shop/home" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
