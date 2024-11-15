import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderDetails: {
    userId: null,
    items: [],
    createdAt: null,
    updatedAt: null,
  },
};

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {
    setOrderDetailsData: (state, action) => {
      console.log("items", action.payload.items);
      console.log("action payload", action.payload);
      state.orderDetails = {
        userId: action.payload.userId,
        items: action.payload.items.map((item) => ({
          product: item.product,
          selectedSize: item.selectedSize,

          selectedColor: item.selectedColor,
          quantity: item.quantity,
        })),
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
    },
  },
});

export const { setOrderDetailsData } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;
