import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3005/cart/${id}`);
      console.log("response in fetch cart", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, { rejectWithValue, dispatch }) => {
    try {
      console.log(item);
      const response = await axios.post(
        `http://localhost:3005/cart/add/`,
        item
      );
      dispatch(updateCart(response.data));
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ id, newItem }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3005/cart/remove/${id}`,
        {
          data: newItem,
        }
      );
      dispatch(updateCart(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async ({ id, productId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(
        `http://localhost:3005/cart/increase/${id}`,
        { productId }
      );
      dispatch(updateCart(response.data));
      console.log("increase quantity : ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async ({ id, productId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(
        `http://localhost:3005/cart/decrease/${id}`,
        { productId }
      );
      dispatch(updateCart(response.data));
      console.log("decrease quantity : ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3005/cart/clear/${id}`
      );
      dispatch(updateCart(response.data));
      console.log("clear cart: ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
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
      console.log("items inside update cart: ,", action.payload);
      state.items = action.payload.items;
    },
  },
  extraReducers: (builder) => {
    // Existing cases for fetchCart, addToCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action payload:", action.payload.items);
        state.items = action.payload.items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      });
  },
});

export const { updateCart } = cartSlice.actions;
export default cartSlice.reducer;
