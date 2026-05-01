import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// REGISTER USER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/register",
      formData,
      { withCredentials: true }
    );
    return response.data;
  }
);

// LOGIN USER
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/login",
      formData,
      { withCredentials: true }
    );
    return response.data;
  }
);

// CHECK AUTH
export const checkAuth = createAsyncThunk(
  "auth/check-auth",
  async () => {
    const response = await axios.get(
      "http://localhost:3000/api/auth/check-auth",
      { withCredentials: true }
    );
    return response.data;
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;

        // ✅ FIX
        state.user = action.payload?.user;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;

        // ✅ FIX
        state.user = action.payload?.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload?.success;

        // ✅ already correct
        state.user = action.payload?.user ?? null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
