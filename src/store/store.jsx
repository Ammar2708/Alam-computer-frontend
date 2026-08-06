import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index";
import AdminProductslice from "./admin/product-slice/Index";
import ShopProductSlice from "./shop/product-slice/index";
import shoppingCartSlice from "./shop/cart-slice/index";
import popupReducer from "./popup/popupSlice"; 
import sliderReducer from "./slider/sliderSlice";
import shopOrderSlice from "./order-slice/index";
import checkoutSettingsReducer from "./settings-slice";

const reducer = {
    auth: authReducer,
    adminProducts: AdminProductslice,
    shopProducts: ShopProductSlice,
    cart: shoppingCartSlice,
    popup: popupReducer, 
    slider: sliderReducer,
    orders: shopOrderSlice,
    checkoutSettings: checkoutSettingsReducer,
};

export const createAppStore = (preloadedState) =>
  configureStore({ reducer, preloadedState });

export const store = createAppStore();
