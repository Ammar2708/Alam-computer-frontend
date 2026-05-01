// src/redux/slices/popupSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLatestPopup = createAsyncThunk(
  "popup/fetchLatestPopup",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/api/latest-popup");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch popup"
      );
    }
  }
);

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    popup: null,
    isOpen: false,
    loading: false,
    error: null,
  },
  reducers: {
    openPopup: (state) => {
      state.isOpen = true;
    },
    closePopup: (state) => {
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestPopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestPopup.fulfilled, (state, action) => {
        state.loading = false;
        state.popup = action.payload;
        state.isOpen = !!action.payload;
      })
      .addCase(fetchLatestPopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { openPopup, closePopup } = popupSlice.actions;
export default popupSlice.reducer;