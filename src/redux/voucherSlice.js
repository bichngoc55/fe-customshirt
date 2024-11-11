import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const createVoucher = createAsyncThunk(
  "vouchers/createVoucher",
  async (voucherData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3005/voucher",
        voucherData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getVouchers = createAsyncThunk(
  "vouchers/getVouchers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching vouchers");
      const response = await axios.get("http://localhost:3005/voucher");
      //   console.log("Fetched vouchers", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getVoucherById = createAsyncThunk(
  "vouchers/getVoucherById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3005/voucher/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateVoucher = createAsyncThunk(
  "vouchers/updateVoucher",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3005/voucher/${id}`,
        updates
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteVoucher = createAsyncThunk(
  "vouchers/deleteVoucher",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3005/voucher/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const validateVoucher = createAsyncThunk(
  "vouchers/validateVoucher",
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3005/voucher/validate/${code}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getVoucherStats = createAsyncThunk(
  "vouchers/getVoucherStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3005/voucher/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const voucherSlice = createSlice({
  name: "vouchers",
  initialState: {
    vouchers: [],
    voucher: null,
    voucherStats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers.push(action.payload.data);
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVouchers.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("Fetched vouchers", action.payload.data);
        state.vouchers = action.payload.data;
      })
      .addCase(getVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getVoucherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVoucherById.fulfilled, (state, action) => {
        state.loading = false;
        state.voucher = action.payload.data;
      })
      .addCase(getVoucherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vouchers.findIndex(
          (v) => v._id === action.payload.data._id
        );
        state.vouchers[index] = action.payload.data;
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = state.vouchers.filter((v) => v._id !== action.payload);
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(validateVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.voucher = action.payload.data;
      })
      .addCase(validateVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getVoucherStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVoucherStats.fulfilled, (state, action) => {
        state.loading = false;
        state.voucherStats = action.payload.data;
      })
      .addCase(getVoucherStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = voucherSlice.actions;
export default voucherSlice.reducer;
