import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApiUrl } from "@/config/api";

const initialState = {
  cartItems: { items: [] },
  isLoading: false,
};

const BASE_URL = getApiUrl("/api/shop/cart");

const normalizeCartData = (data) => {
  if (Array.isArray(data)) {
    return { items: data };
  }

  if (data && Array.isArray(data.items)) {
    return data;
  }

  return { items: [] };
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, popupSnapshot }) => {
    const response = await axios.post(`${BASE_URL}/add`, {
      userId,
      productId,
      quantity,
      popupSnapshot,
    });
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    // Fixed: Added /get/ to match your router
    const response = await axios.get(`${BASE_URL}/get/${userId}`);
    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    // Fixed: Your controller uses req.body, so we pass 'data' in the config
    const response = await axios.delete(`${BASE_URL}/delete`, {
      data: { userId, productId },
    });
    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    // Fixed: URL changed from update-cart to update to match router
    const response = await axios.put(`${BASE_URL}/update`, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })
      // FETCH
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = normalizeCartData(action.payload?.data);
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = { items: [] };
      })
      // UPDATE
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = normalizeCartData(action.payload?.data);
      })
      // DELETE
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = normalizeCartData(action.payload?.data);
      });
  },
});

export default shoppingCartSlice.reducer;
