import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3005/order";

// Auto-refuse unconfirmed orders
export const autoRefuseUnconfirmedOrders = createAsyncThunk(
  "orders/autoRefuseUnconfirmedOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/auto-refuse`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Fetch all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Fetch all orders by id
export const fetchOrdersDetails = createAsyncThunk(
  "orders/fetchOrdersDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/customer/${id}`);
      console.log("cuu toi vs: ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/add`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update order
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateOrderShipping = createAsyncThunk(
  "orders/updateOrderShipping",
  async ({ id, shippingData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/orders/${id}/shipping`,
        shippingData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Delete order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update delivery status
export const updateDeliveryStatus = createAsyncThunk(
  "orders/updateDeliveryStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/delivery-status`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus", 
  async ( id, status , { rejectWithValue }) => {
    try {
      console.log("status", status);
      const response = await axios.put(`${API_URL}/${id}/status`, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    status: "idle",
    error: null,
    cancelStatus: "idle",
    updateStatus: "idle",
    autoRefuseStatus: "idle",
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // Create Order
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to create order";
      })

      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload?.message || "Failed to update order";
      })

      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.cancelStatus = "loading";
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancelStatus = "succeeded";
        console.log("Cancelled Order", state.cancelStatus);
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancelStatus = "failed";
        state.error = action.payload?.message || "Failed to cancel order";
      })

      // Update Delivery Status
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        action.payload.updatedOrders.forEach((updatedOrder) => {
          const index = state.orders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (index !== -1) {
            state.orders[index] = updatedOrder;
          }
        });
        state.error = null;
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Failed to update delivery status";
      })

      // Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete order";
      })
      // Auto-refuse unconfirmed orders
      .addCase(autoRefuseUnconfirmedOrders.pending, (state) => {
        state.autoRefuseStatus = "loading";
      })
      .addCase(autoRefuseUnconfirmedOrders.fulfilled, (state, action) => {
        if (action.payload.count === 0) {
          // state.error = "No unconfirmed orders to auto-refuse.";
          return;
        }
        state.autoRefuseStatus = "succeeded";

        action.payload?.updatedOrders?.forEach((refusedOrder) => {
          const index = state.orders.findIndex(
            (order) => order._id === refusedOrder._id
          );
          if (index !== -1) {
            state.orders[index] = refusedOrder;
          }
        });

        state.error = null;
      })
      .addCase(autoRefuseUnconfirmedOrders.rejected, (state, action) => {
        state.autoRefuseStatus = "failed";
        state.error =
          action.payload?.message || "Failed to auto-refuse unconfirmed orders";
      })
      // Add Fetch Orders Details
      .addCase(fetchOrdersDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        // const orderIndex = state.orders.findIndex(
        //   (order) => order._id === action.payload._id
        // );
        // if (orderIndex !== -1) {
        //   state.orders[orderIndex] = action.payload;
        // } else {
        //   state.orders.push(action.payload);
        // }
        console.log("action payload: ", action.payload);
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrdersDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to fetch order details";
      })
      .addCase(updateOrderShipping.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateOrderShipping.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrderShipping.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload?.message || "Failed to update shipping information";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        action.payload.updatedOrders.forEach((updatedOrder) => {
          const index = state.orders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (index !== -1) {
            state.orders[index] = updatedOrder;
          }
        });
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Failed to update delivery status";
      })
    },
});

export const { clearErrors } = orderSlice.actions;
export default orderSlice.reducer;
