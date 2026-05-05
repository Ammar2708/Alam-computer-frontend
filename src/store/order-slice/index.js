import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiUrl } from "@/config/api";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  lastCreatedOrder: null,
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        getApiUrl("/api/shop/orders/create"),
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "An error occurred while creating the order.",
        }
      );
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  "orders/fetchAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(getApiUrl("/api/admin/orders/get"));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "An error occurred while fetching admin orders.",
        }
      );
    }
  }
);

export const updateAdminOrderStatus = createAsyncThunk(
  "orders/updateAdminOrderStatus",
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        getApiUrl(`/api/admin/orders/status/${orderId}`),
        { orderStatus }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "An error occurred while updating the order status.",
        }
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCreatedOrder = action.payload?.data ?? null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create order.";
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload?.data || action.payload?.orders || [];
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error =
          action.payload?.message || "Failed to fetch admin orders.";
      })
      .addCase(updateAdminOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload?.data;
        if (!updatedOrder?._id) return;

        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Failed to update order status.";
      });
  },
});

export const { clearOrdersError } = orderSlice.actions;
export default orderSlice.reducer;
