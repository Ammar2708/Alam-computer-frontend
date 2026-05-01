// import axiox from "axios";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const initialState = {
//     cartItems: { items: [] },
//     isLoading: false,
// };

// export const addToCart = createAsyncThunk(
//     "cart/addToCart",
//     async ({ userId, productId, quantity }) => {
//         const response = await axiox.post(
//             `http://localhost:3000/api/shop/cart/add`,
//             {
//                 userId,
//                 productId,
//                 quantity,
//             },
//         );
//         return response.data;
//     },
// );

// export const fetchCartItems = createAsyncThunk(
//     "cart/fetchCartItems",
//     async (userId) => {
//         const response = await axiox.get(
//             `http://localhost:3000/api/shop/cart/${userId}`,
//         );
//         return response.data;
//     },
// );

// export const deleteCartItem = createAsyncThunk(
//     "cart/deleteCartItem",
//     async ({ userId, productId }) => {
//         const response = await axiox.delete(
//             `http://localhost:3000/api/shop/cart/${userId}/${productId}`,
//         );
//         return response.data;
//     },
// );

// export const updateCartQuantity = createAsyncThunk(
//     "cart/updateCartQuantity",
//     async ({ userId, productId, quantity }) => {
//         const response = await axiox.put(
//             `http://localhost:3000/api/shop/cart/update-cart`,
//             {
//                 userId,
//                 productId,
//                 quantity,
//             },
//             );
//         return response.data;
//     },
// );

// const shoppingCartSlice = createSlice({
//     name: "shoppingCart",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(addToCart.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(addToCart.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 if (action.payload?.data) {
//                     state.cartItems = action.payload.data;
//                 }
//             })
//             .addCase(addToCart.rejected, (state) => {
//                 state.isLoading = false;
//             })
//             .addCase(fetchCartItems.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(fetchCartItems.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.cartItems = action.payload.data;
//             })
//             .addCase(fetchCartItems.rejected, (state) => {
//                 state.isLoading = false;
//                 state.cartItems = { items: [] };
//             })
//             .addCase(updateCartQuantity.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(updateCartQuantity.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.cartItems = action.payload.data;
//             })
//             .addCase(updateCartQuantity.rejected, (state) => {
//                 state.isLoading = false;
//                  state.cartItems = { items: [] };
//             })
//             .addCase(deleteCartItem.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(deleteCartItem.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.cartItems = action.payload.data;
//             })
//             .addCase(deleteCartItem.rejected, (state) => {
//                 state.isLoading = false;
//                 state.cartItems = { items: [] };
//             });
//     },
// })

// export default shoppingCartSlice.reducer;


import axios from "axios"; // Fixed typo
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: { items: [] },
  isLoading: false,
};

const BASE_URL = "http://localhost:3000/api/shop/cart";

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
