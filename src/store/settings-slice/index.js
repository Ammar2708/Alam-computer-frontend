import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const defaultCheckoutSettings = {
  deliveryCharge: 0,
};

export const fetchCheckoutSettings = createAsyncThunk(
  "checkoutSettings/fetchCheckoutSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/settings/checkout`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "An error occurred while fetching checkout settings.",
        }
      );
    }
  }
);

export const updateCheckoutSettings = createAsyncThunk(
  "checkoutSettings/updateCheckoutSettings",
  async ({ deliveryCharge }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/settings/checkout`,
        { deliveryCharge }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "An error occurred while updating checkout settings.",
        }
      );
    }
  }
);

const checkoutSettingsSlice = createSlice({
  name: "checkoutSettings",
  initialState: {
    checkoutSettings: defaultCheckoutSettings,
    isLoading: false,
    isSaving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckoutSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCheckoutSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.checkoutSettings = action.payload?.data || defaultCheckoutSettings;
      })
      .addCase(fetchCheckoutSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.checkoutSettings = defaultCheckoutSettings;
        state.error =
          action.payload?.message || "Failed to fetch checkout settings.";
      })
      .addCase(updateCheckoutSettings.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateCheckoutSettings.fulfilled, (state, action) => {
        state.isSaving = false;
        state.checkoutSettings = action.payload?.data || defaultCheckoutSettings;
      })
      .addCase(updateCheckoutSettings.rejected, (state, action) => {
        state.isSaving = false;
        state.error =
          action.payload?.message || "Failed to update checkout settings.";
      });
  },
});

export default checkoutSettingsSlice.reducer;
