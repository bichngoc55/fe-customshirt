import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShippingCard from "../shippingCard";
import "./OrderSummary.css";
import { useDispatch, useSelector } from "react-redux";
import { getVouchers, validateVoucher } from "../../redux/voucherSlice";
import {
  setTotalFee,
  setShippingFee,
  setVoucherData,
} from "../../redux/shippingSlice";

const CustomSelect = styled(Select)({
  width: "100%",
  "& .MuiSelect-select": {
    padding: "8px 32px 8px 16px",
    fontSize: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #ccc",
    "&:focus": {
      backgroundColor: "#fff",
      borderColor: "#4d4d4d",
    },
  },
  "& .MuiSvgIcon-root": {
    color: "#4d4d4d",
  },
});

const OrderSummary = ({ items }) => {
  const dispatch = useDispatch();
  const { vouchers } = useSelector((state) => state.voucher);
  const { user } = useSelector((state) => state.auths);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  // const [selectedVoucherApplied, setSelectedVoucherApplied] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { shippingData, deliveryData } = useSelector((state) => state.shipping);

  // const [shippingData, setShippingData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const { voucherData } = useSelector((state) => state.shipping);
  useEffect(() => {
    dispatch(getVouchers());
    // console.log("shippingData", shippingData);
    // console.log("items inside order summary", items);
  }, [dispatch]);

  const calculateSalePrice = (product) => {
    if (product.isSale) {
      return product.price * (1 - product.salePercent / 100);
    }
    return product.price;
  };
  // const renderVoucherMenuItem = (voucher) => (
  //   <MenuItem
  //     key={voucher._id}
  //     value={voucher.code}
  //     disabled={!voucher.isApplicable}
  //     sx={{
  //       opacity: voucher.isApplicable ? 1 : 0.5,
  //       color: voucher.isApplicable ? "inherit" : "gray",
  //       "&:hover": {
  //         backgroundColor: voucher.isApplicable
  //           ? "rgba(0, 0, 0, 0.04)"
  //           : "none",
  //       },
  //     }}
  //   >
  //     {voucher.code} - {voucher.discount}% off
  //     {!voucher.isApplicable && " (Not Applicable)"}
  //   </MenuItem>
  // );
  const renderVoucherMenuItem = (voucher) => (
    <MenuItem key={voucher._id} value={voucher.code}>
      {voucher.code} - {voucher.discount}% off
    </MenuItem>
  );
  useEffect(() => {
    const total = calculateTotal();
    dispatch(
      getVouchers({
        userId: user?.id,
        orderTotal: total,
      })
    );
  }, [dispatch, user, items]);
  const calculateTotal = () => {
    let total = items.reduce((total, item) => {
      const price = item.product.salePercent
        ? calculateSalePrice(item.product)
        : item.product.price;
      return total + price * item.quantity;
    }, 0);

    if (voucherData) {
      total = total * (1 - voucherData.discount / 100);
    }

    return total;
  };
  const handleTotalFee = () => {
    const total = calculateTotal() + calculateShippingFee();
    dispatch(setTotalFee(total));
    return total;
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const calculateShippingFee = () => {
    if (!shippingData?.province) {
      return 0;
    }

    const majorCities = ["79"];

    let shippingFee = majorCities.includes(shippingData.province)
      ? 15000
      : 35000;
    if (deliveryData === "standard") {
      shippingFee += 0;
    } else if (deliveryData === "express") {
      shippingFee += 15000;
    } else if (deliveryData === "same-day") {
      shippingFee += 75000;
    }
    dispatch(setShippingFee(shippingFee));
    return shippingFee;
  };

  const calculateDiscountValue = () => {
    if (voucherData) {
      const originalTotal = items.reduce((total, item) => {
        const price = item.product.salePercent
          ? calculateSalePrice(item.product)
          : item.product.price;
        return total + price * item.quantity;
      }, 0);
      return ((originalTotal - calculateTotal()) / originalTotal) * 100;
    }
    return 0;
  };
  const handleVoucherApply = async () => {
    if (!selectedVoucher) {
      setSnackbarMessage("Please select a voucher");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      const result = await dispatch(
        validateVoucher({
          code: selectedVoucher,
          userId: user?.id,
        })
      );

      if (result.payload?.success) {
        dispatch(setVoucherData(result.payload.data));
        setSnackbarMessage("Voucher applied successfully");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(result.payload?.message || "Invalid voucher");
        setSnackbarSeverity("warning");
        dispatch(setVoucherData(null));
      }
    } catch (error) {
      setSnackbarMessage("Error applying voucher");
      setSnackbarSeverity("error");
      dispatch(setVoucherData(null));
    }

    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "15px",
        marginLeft: "50px",
        width: "100%",
        top: "130px",
        maxWidth: "1200px",
      }}
    >
      <div className="order-summary">
        <h2 style={{ fontSize: "25px" }}>Order Summary</h2>
        <div className="order-items">
          <div style={{ fontSize: "16px", marginBottom: "10px" }}>
            Order Items
          </div>
          <ShippingCard items={items} />
        </div>
        <div className="gift-card-section">
          <div style={{ fontSize: "16px", marginBottom: "10px" }}>
            Voucher code
            {!user && calculateTotal() < 400000 && (
              <Typography variant="caption" color="text.secondary">
                (Login or order above 400,000 VND to access vouchers)
              </Typography>
            )}
          </div>
          <div className="input-container">
            <CustomSelect
              id="gift-card"
              onChange={(e) => setSelectedVoucher(e.target.value)}
            >
              <MenuItem value="">Select</MenuItem>
              {vouchers.map((voucher) => (
                <MenuItem key={voucher._id} value={voucher.code}>
                  {voucher.code} - {voucher.discount}% off
                </MenuItem>
              ))}
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </CustomSelect>
            {/* <CustomSelect
              id="gift-card"
              onChange={(e) => setSelectedVoucher(e.target.value)}
              disabled={!user || calculateTotal() < 400000}
            >
              <MenuItem value="">Select</MenuItem>
              {vouchers.map(renderVoucherMenuItem)}
            </CustomSelect> */}

            <Button
              variant="contained"
              color="success"
              onClick={handleVoucherApply}
            >
              Apply
            </Button>
          </div>
        </div>
        <div className="order-summary-details">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>Subtotal:</p>
            <Typography sx={{ color: "#C8FFF6" }}>
              {calculateTotal().toLocaleString()}đ
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              Shipping Fee:
            </p>
            <Typography sx={{ color: "#C8FFF6" }}>
              {calculateShippingFee().toLocaleString()}đ
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              Discount value:
            </p>
            <Typography sx={{ color: "#C8FFF6" }}>
              {calculateDiscountValue().toFixed(2)}%
            </Typography>
          </div>
          <div className="divider"></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Total due:</h3>
            <Typography sx={{ color: "#C8FFF6" }}>
              {handleTotalFee().toLocaleString()}đ{" "}
            </Typography>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderSummary;
