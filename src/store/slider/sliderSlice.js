import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/config/api";

const BASE_URL = getApiUrl("/api/slider");

// 🔹 Get all sliders (admin)
export const fetchAllSliders = createAsyncThunk(
  "slider/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching sliders");
    }
  }
);

// 🔹 Create slider
export const createSlider = createAsyncThunk(
  "slider/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/admin`, formData);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating slider");
    }
  }
);

// 🔹 Update slider
export const updateSlider = createAsyncThunk(
  "slider/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/admin/${id}`, formData);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating slider");
    }
  }
);

// 🔹 Delete slider
export const deleteSlider = createAsyncThunk(
  "slider/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/admin/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting slider");
    }
  }
);

const sliderSlice = createSlice({
  name: "slider",
  initialState: {
    sliderList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🔹 Fetch all
      .addCase(fetchAllSliders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllSliders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sliderList = action.payload;
      })
      .addCase(fetchAllSliders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 🔹 Create
      .addCase(createSlider.fulfilled, (state, action) => {
        state.sliderList.unshift(action.payload);
      })

      // 🔹 Update
      .addCase(updateSlider.fulfilled, (state, action) => {
        const index = state.sliderList.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.sliderList[index] = action.payload;
        }
      })

      // 🔹 Delete
      .addCase(deleteSlider.fulfilled, (state, action) => {
        state.sliderList = state.sliderList.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default sliderSlice.reducer;
