import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const refreshAccessToken = createAsyncThunk(
//   "auth/refreshAccessToken",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const { refreshToken } = getState().auths;
//       if (!refreshToken) {
//         throw new Error("Refresh token is missing");
//       }

//       const response = await fetch("http://localhost:3000/auth/refresh", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to refresh access token");
//       }

//       const data = await response.json();
//       return data.token;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3005/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue({
          message: data.msg || data.message,
          field:
            data.message === "Invalid email"
              ? "email"
              : data.msg === "User already exists"
              ? "email"
              : data.msg === "Password must be at least 6 characters"
              ? "password"
              : "general",
        });
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message, field: "general" });
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("trong auth slice :", credentials);
      const response = await fetch("http://localhost:3005/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Login failed");
      }

      const data = await response.json();
      //   console.log("data trong auth slice: ", data);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("token");
      console.log("Removed user and tokens from storage");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    error: null,
    role: null,
  },
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    updateAccessToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        state.isFetching = false;
        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
        console.log("Removed user and tokens from storage", state.token);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // .addCase(registerUser.pending, (state) => {
      //   state.isFetching = true;
      //   state.error = null;
      // })
      // .addCase(registerUser.fulfilled, (state, action) => {
      //   state.user = action.payload.user;
      //   state.token = action.payload.token;
      //   state.role = action.payload.user.role;
      //   state.isFetching = false;
      //   state.error = null;
      // })
      // .addCase(registerUser.rejected, (state, action) => {
      //   state.isFetching = false;
      //   state.error = action.payload;
      // });
      .addCase(registerUser.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isFetching = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload.message;
      });
  },
});

export const { setMode, updateAccessToken } = authSlice.actions;

export default authSlice.reducer;
