import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductslice from "./admin/product-slice";
import ShopProductSlice from "./shop/product-slice";
import shoppingCartSlice from "./shop/cart-slice";
import popupReducer from "./popup/popupSlice"; 
import sliderReducer from "./slider/sliderSlice";
import shopOrderSlice from "./order-slice/index";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: AdminProductslice,
    shopProducts: ShopProductSlice,
    cart: shoppingCartSlice,
    popup: popupReducer, 
    slider: sliderReducer,
    orders: shopOrderSlice,
  },
});
