// import {Route, Routes} from "react-router-dom";
// import AuthLayout from "./components/auth/layout";
// import AuthLogin from "./pages/auth/Login";
// import AuthRegister from "./pages/auth/Register";
// import AdminLayout from "./components/admin-view/dummy/Layout";
// import AdminDashboard from "./pages/admin-view/Dashboard";
// import AdminProduct from "./pages/admin-view/Product";
// import AdminFeatures from "./pages/admin-view/Features";
// import AdminOrders from "./pages/admin-view/Orders";

// import ShoppingLayout from "./components/shoppping-view/Layout";
// import ShoppingHome from "./pages/shopping-view/Home";
// import ShoppingListing from "./pages/shopping-view/Listing";
// import ShoppingAccount from "./pages/shopping-view/Account";
// import ShoppingCheckout from "./pages/shopping-view/Checkout";
// import NotFound from "./pages/not-found/Index";
// import CheckAuth from "./components/comman/CheckAuth";
// import UnauthPage from "./pages/unauth/Index";
// import { useEffect } from "react";
// import { checkAuth } from "./store/auth-slice";
// import { useDispatch, useSelector } from "react-redux";


// function App() {
//   //const isAuthenticated = false;
//   //const user = null;
//    const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);
//   return (
//     <div className="flex flex-col overflow-hidden bg-white">
//       <Routes>
//         <Route path="/auth"
//          element={
//           <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//          <AuthLayout />
//          </CheckAuth>
//          }
//          >
//           <Route path="login" element={<AuthLogin />} />
//           <Route path="register" element={<AuthRegister />} />
//         </Route>

//         <Route
//          path="/admin"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//           <AdminLayout />
//           </CheckAuth>
//           }>
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="product" element={<AdminProduct />} />
//           <Route path="features" element={<AdminFeatures />} />
//           <Route path="orders" element={<AdminOrders />} />
//         </Route>

//         <Route
//          path="/shop"
         
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//           <ShoppingLayout />
//           </CheckAuth>
//           }>
//           <Route path="home" element={<ShoppingHome />} />
//           <Route path="listing" element={<ShoppingListing />} />
//           <Route path="account" element={<ShoppingAccount />} />
//           <Route path="checkout" element={<ShoppingCheckout />} />
         
//         </Route>
//          <Route path="*" element={<NotFound />} />
//          <Route path="/unauth-page" element={<UnauthPage />} /> 
//       </Routes>

//     </div>
//   );
// }

// export default App



import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/Login";
import AuthRegister from "./pages/auth/Register";
import AdminLayout from "./components/admin-view/dummy/Layout";
import AdminDashboard from "./pages/admin-view/Dashboard";
import AdminProducts from "./pages/admin-view/Product";
import AdminFeatures from "./pages/admin-view/Features";
import AdminOrders from "./pages/admin-view/Orders";
import AdminPopup from "./pages/admin-view/popup";
import AdminSlider from "./pages/admin-view/Slider";
import AdminSettings from "./pages/admin-view/Settings";

import ShoppingLayout from "./components/shoppping-view/Layout";
import ShoppingHome from "./pages/shopping-view/Home";
import ShoppingListing from "./pages/shopping-view/Listing";
import ShoppingAccount from "./pages/shopping-view/Account";
import ShoppingCheckout from "./pages/shopping-view/Checkout";
import Contact from "./components/shoppping-view/Contact";
import NotFound from "./pages/not-found/Index";
import CheckAuth from "./components/comman/CheckAuth";
import RequireAuthDialog from "./components/comman/RequireAuthDialog";
import ScrollToTop from "./components/comman/ScrollToTop";
import UnauthPage from "./pages/unauth/Index";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import About from "./components/shoppping-view/About";
import {
  FaqPage,
  PrivacyPage,
  PrivacyPolicyPage,
  SecurityPage,
  TermsPage,
} from "./components/shoppping-view/PolicyPages";



function App() {
  // const isAuthenticated = false;
  // const user = null;
  // const user = {
  //   name: "Rahul",
  //   role: "admin",
  // };
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex flex-col overflow-x-hidden bg-white">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/shop/home" replace />} />
        <Route
          path="/auth"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              user={user}
            >
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              user={user}
            >
              <AdminLayout />
            </CheckAuth>
          }
        >
          {/* nested routes for admin */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="popup" element={<AdminPopup />} />
          <Route path="slider" element={<AdminSlider />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route
          path="/shop"
          element={<ShoppingLayout />}
        >
          {/* nested routes for shopping */}
          <Route index element={<ShoppingHome />} />
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route
            path="account"
            element={
              <RequireAuthDialog
                title="Login To View Account"
                description="Please login to view and manage your account details."
              >
                <ShoppingAccount />
              </RequireAuthDialog>
            }
          />
          <Route
            path="checkout"
            element={
              <RequireAuthDialog
                title="Login To Checkout"
                description="Please login first so we can load your cart and continue checkout."
              >
                <ShoppingCheckout />
              </RequireAuthDialog>
            }
          />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />

        </Route>
        <Route path="/cart" element={<Navigate to="/shop/checkout" replace />} />
        <Route element={<ShoppingLayout />}>
          <Route path="Laptop" element={<Navigate to="/shop/listing?category=Laptop" replace />} />
          <Route path="Monitor" element={<Navigate to="/shop/listing?category=Lcd" replace />} />
          <Route path="Printer" element={<Navigate to="/shop/listing?category=Printer" replace />} />
          <Route path="Ink" element={<Navigate to="/shop/listing?category=Ink" replace />} />
          <Route path="HDD" element={<Navigate to="/shop/listing?category=HDD" replace />} />
          <Route path="SSD" element={<Navigate to="/shop/listing?category=SSD" replace />} />
          <Route path="Network" element={<Navigate to="/shop/listing?category=Network" replace />} />
          <Route path="All" element={<Navigate to="/shop/listing?category=All%20In%20One" replace />} />
          <Route path="Towner" element={<Navigate to="/shop/listing?category=Towner" replace />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="faqs" element={<Navigate to="/faq" replace />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="term" element={<Navigate to="/terms" replace />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="policies" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="security" element={<SecurityPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/unauth-page" element={<UnauthPage />} />
      </Routes>
    </div>
  );
}

export default App;
