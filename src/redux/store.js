import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import shippingReducer from "./shippingSlice";
import orderReducer from "./orderSlice";
import voucherReducer from "./voucherSlice";
import orderDetailsReducer from "./orderDetailSlice";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
  auths: authReducer,
  cart: cartReducer,
  voucher: voucherReducer,
  shipping: shippingReducer,
  orderDetails: orderDetailsReducer,
  orders: orderReducer,
});

const persistConfig = {
  key: "root",
  storage: storage,
  blacklist: ["orders"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);
export { persistor };
