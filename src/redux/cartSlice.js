import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3005/cart/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Add to cart thunk
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { userId, productId, selectedSize, selectedColor, quantity },
    { rejectWithValue }
  ) => {
    try {
      console.log(productId, selectedSize, selectedColor, quantity);
      const response = await axios.post(
        `http://localhost:3005/cart/${userId}`,
        {
          productId,
          selectedSize,
          selectedColor,
          quantity,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Async thunk for removing item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, itemId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3005/cart/${userId}/items/${itemId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating quantity
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ userId, itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3005/cart/${userId}/items/${itemId}`,
        {
          quantity,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for clearing cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3005/cart/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    error: null,
    loading: false,
  },
  reducers: {
    updateCart: (state, action) => {
      state.items = action.payload.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.error = null;
      })
      // Update quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.error = null;
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.error = null;
      });
  },
});

export const { updateCart } = cartSlice.actions;
export default cartSlice.reducer;
