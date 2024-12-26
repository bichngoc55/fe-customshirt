import { createSlice } from "@reduxjs/toolkit";

const designSlice = createSlice({
  name: "design",
  initialState: {
    currentDesign: null,
  },
  reducers: {
    setCurrentDesign: (state, action) => {
      //   console.log("trong action payload: ", action.payload);
      state.currentDesign = action.payload;
    },
    clearCurrentDesign: (state) => {
      state.currentDesign = null;
    },
  },
});

export const { setCurrentDesign, clearCurrentDesign } = designSlice.actions;
export default designSlice.reducer;
