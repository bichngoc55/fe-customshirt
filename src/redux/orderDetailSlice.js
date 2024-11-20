import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderDetails: {
    userId: null,
    items: [],
    createdAt: null,
    updatedAt: null,
  },
};

export const orderDetailSlice = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {
    setOrderDetailsData: (state, action) => {
      state.orderDetails = { ...action.payload };
    },
  },
});

export const { setOrderDetailsData } = orderDetailSlice.actions;

export default orderDetailSlice.reducer;
