import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Modified getVouchers to handle user and order total
export const getVouchers = createAsyncThunk(
  "vouchers/getVouchers",
  async ({ userId, orderTotal } = {}, { rejectWithValue }) => {
    try {
      let url = "http://localhost:3005/voucher";
      const params = new URLSearchParams();

      if (orderTotal) params.append("orderTotal", orderTotal);
      if (userId) params.append("userId", userId);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// New thunk for creating birthday voucher
export const createBirthdayVoucher = createAsyncThunk(
  "vouchers/createBirthdayVoucher",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3005/voucher/birthday",
        { userId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Modified validateVoucher to include user info
export const validateVoucher = createAsyncThunk(
  "vouchers/validateVoucher",
  async ({ code, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3005/voucher/validate/${code}`,
        {
          params: { userId },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Keep other existing thunks...
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

// Updated Slice
const voucherSlice = createSlice({
  name: "vouchers",
  initialState: {
    vouchers: [],
    voucher: null,
    voucherStats: null,
    loading: false,
    error: null,
    birthdayVoucher: null,
    totalValueVoucher: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVoucher: (state) => {
      state.voucher = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getVouchers
      .addCase(getVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload.data.map((voucher) => ({
          ...voucher,
          isApplicable: voucher.hasOwnProperty("isApplicable")
            ? voucher.isApplicable
            : true,
        }));

        // Handle special vouchers
        const birthdayVoucher = state.vouchers.find((v) =>
          v.code?.startsWith("BDAY-")
        );
        const totalValueVoucher = state.vouchers.find(
          (v) => v.code === "TOTAL30"
        );

        if (birthdayVoucher) state.birthdayVoucher = birthdayVoucher;
        if (totalValueVoucher) state.totalValueVoucher = totalValueVoucher;
      })
      .addCase(getVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createBirthdayVoucher
      .addCase(createBirthdayVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.birthdayVoucher = action.payload.data;
        state.vouchers.push(action.payload.data);
      })

      // Handle validateVoucher
      .addCase(validateVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.voucher = action.payload.data;

        // Update voucher applicability in the list
        if (action.payload.data) {
          const index = state.vouchers.findIndex(
            (v) => v.code === action.payload.data.code
          );
          if (index !== -1) {
            state.vouchers[index] = {
              ...state.vouchers[index],
              ...action.payload.data,
            };
          }
        }
      })

      // Keep other existing cases...
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
        if (index !== -1) {
          state.vouchers[index] = action.payload.data;
        }
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

export const { clearError, clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
