import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/config/api";
const initialState = {
  productList: [],
  isLoading: false,
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filtersParams = {}, sortParams = "price-lowtohigh" }) => {
    const query = new URLSearchParams({
      ...filtersParams,
      sortBy: sortParams,
    });
    const result = await axios.get(
      getApiUrl(`/api/shop/products/get?${query.toString()}`),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return result.data;
  },
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      getApiUrl(`/api/shop/products/get/${id}`),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return result.data;
  },
);

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { resetProductDetails } = ProductSlice.actions;
export default ProductSlice.reducer;

