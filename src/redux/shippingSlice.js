import { createSlice } from "@reduxjs/toolkit";
import { detectCardType } from "../utils/orderUtils";
const initialState = {
  shippingData: {
    name: null,
    email: null,
    phone: null,
    province: null,
    district: null,
    provinceId: null,
    districtId: null,
    address: null,
  },
  deliveryData: null,
  paymentData: {
    method: null,
    status: "pending",
    cardDetails: null,
    transactionId: null,
  },
  totalFee: null,
  shippingFee: null,
  voucherData: {
    code: null,
    discount: 0,
  },
  orderDetails: [],
};
const shippingSlice = createSlice({
  name: "shipping",
  initialState: initialState,
  reducers: {
    setShippingData: (state, action) => {
      state.shippingData = action.payload;
    },
    setDeliveryData: (state, action) => {
      state.deliveryData = action.payload;
    },
    // setPaymentData: (state, action) => {
    //   state.paymentData = action.payload;
    // },
    setPaymentData: (state, action) => {
      const { method, cardDetails } = action.payload;
      state.paymentData = {
        method,
        status: "pending",
        ...(method === "Credit_Card" && {
          cardDetails: {
            ...cardDetails,
            cardBrand: detectCardType(cardDetails.cardNumber),
            last4Digits: cardDetails.cardNumber.slice(-4),
          },
        }),
      };
    },
    setTotalFee: (state, action) => {
      state.totalFee = action.payload;
    },
    setShippingFee: (state, action) => {
      state.shippingFee = action.payload;
    },
    setVoucherData: (state, action) => {
      console.log("action voucher data: ", action.payload);
      state.voucherData = action.payload
        ? {
            ...action.payload,
            appliedAt: new Date().toISOString(),
          }
        : null;
      console.log("action voucher data: ", state.voucherData);
    },
    resetShippingState: (state) => {
      state.shippingData = initialState.shippingData;
      state.deliveryData = initialState.deliveryData;
      state.paymentData = initialState.paymentData;
      state.totalFee = initialState.totalFee;
      state.shippingFee = initialState.shippingFee;
      state.voucherData = initialState.voucherData;
      state.orderDetails = initialState.orderDetails;
      //   console.log(
      //     "action voucher data: ",
      //     state.voucherData,
      //     "delivery data: ",
      //     state.deliveryData,
      //     "payment data:",
      //     state.paymentData,
      //     "shipping data" + state.setShippingData
      //   );
    },
    resetVoucherState: (state) => {
      state.voucherData = initialState.voucherData;
    },
  },
});
export const {
  setShippingData,
  setDeliveryData,
  setPaymentData,
  setTotalFee,
  setShippingFee,
  resetShippingState,
  setVoucherData,
  resetVoucherState,
} = shippingSlice.actions;
export default shippingSlice.reducer;
