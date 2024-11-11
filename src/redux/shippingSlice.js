import { createSlice } from "@reduxjs/toolkit";

const shippingSlice = createSlice({
  name: "shipping",
  initialState: {
    shippingData: null,
  },
  reducers: {
    setShippingData: (state, action) => {
      state.shippingData = action.payload;
    },
  },
});
export const { setShippingData } = shippingSlice.actions;
export default shippingSlice.reducer;
