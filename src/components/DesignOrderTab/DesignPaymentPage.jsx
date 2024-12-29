import React, { useState } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Modal,
  TextField,
  Button,
  IconButton,
  Alert,
  Snackbar,
  Container,
} from "@mui/material";
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";

import { styled } from "@mui/material/styles";
import CheckoutStepper from "./CheckoutStepper";
import { useDispatch, useSelector } from "react-redux";
import { resetShippingState, setPaymentData } from "../../redux/shippingSlice";
import { useNavigate } from "react-router-dom";
import {
  calculateDeliveryDate,
  detectCardType,
  generateTransactionId,
} from "../../utils/orderUtils";

// Styled components
const StyledTextField = styled(TextField)({
  background: "white",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
});

const DesignPaymentPage = ({
  selectedSize,
  quantity,
  price,
  design,
  onPreviousStep,
  onNextStep,
}) => {
  const {
    shippingData,
    deliveryData,
    paymentData,
    totalFee,
    shippingFee,
    voucherData,
  } = useSelector((state) => state.shipping);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useSelector((state) => state.auths);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState(paymentData || null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolder: "",
  });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const styles = {
    container: {
      minHeight: "100vh",
      //   backgroundColor: "#1A1B1E",
      padding: "24px",
    },
    paymentBox: {
      borderRadius: "15px",
      border: "1px solid #759af9",
      padding: "32px",
      marginTop: "38px",
      width: "100%",
      maxWidth: "800px",
      //   margin: "24px auto",
    },
    title: {
      color: "#C8FFF6",
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "32px",
    },
    paymentOption: {
      marginBottom: "24px",
    },
    radioLabel: {
      color: "white",
      fontSize: "18px",
      "&.Mui-checked": {
        color: "#C8FFF6",
      },
    },
    subtext: {
      color: "#94A3B8",
      marginLeft: "32px",
      fontSize: "14px",
    },
    cardLogos: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginLeft: "auto",
    },
    cardLogo: {
      width: "32px",
      height: "32px",
      color: "white",
      borderRadius: "4px",
    },
    cardForm: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginTop: "24px",
      marginLeft: "32px",
    },
    row: {
      display: "flex",
      gap: "16px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "32px",
    },
    button: {
      backgroundColor: "#4ADE80",
      color: "black",
      padding: "12px 32px",
      marginRight: "16px",
      fontSize: "16px",
      borderRadius: "8px",
      "&:hover": {
        backgroundColor: "#3FCC73",
      },
    },
  };
  const handleCloseModal = () => {
    setLoading(false);
  };
  const resetAllData = () => {
    dispatch(resetShippingState());
    setCardDetails({
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardHolder: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!design || design.length === 0) {
        setSnackbarMessage("Design not found");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }
      if (!shippingData) {
        throw new Error("Shipping information is missing");
      }

      const orderDetail = {
        itemType: "custom",
        design: design._id,
        productSize: selectedSize,
        productColor: design.color,
        productPrice: price,
        productQuantity: quantity,
      };

      const orderDetailResponse = await fetch(
        "http://localhost:3005/orderDetails/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetail),
        }
      );

      if (!orderDetailResponse.ok) {
        throw new Error("Failed to create order detail");
      }

      const createdOrderDetail = await orderDetailResponse.json();

      const initialOrderData = {
        userInfo: {
          userId: user?._id,
          name: shippingData.name,
          phone: shippingData.phone,
          email: shippingData.email,
        },
        items: createdOrderDetail._id,
        voucherId: {
          discount: voucherData?.discount,
          code: voucherData?.code,
        },
        deliveryDate: calculateDeliveryDate(deliveryData),
        total: totalFee,
        shippingFee: shippingFee,
        shippingMethod: deliveryData,
        paymentDetails: {
          method: paymentMethod === "cash" ? "Cash" : "Digital",
          status: "pending",
        },
        billingAddress: {
          province: shippingData.province,
          district: shippingData.district,
          details: shippingData.address,
        },
        branch: Math.floor(Math.random() * 3) + 1,
      };

      const orderResponse = await fetch("http://localhost:3005/order/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initialOrderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        setSnackbarMessage(errorData.message);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const savedOrder = await orderResponse.json();
      console.log("Saved order: ", savedOrder);

      if (paymentMethod === "cash") {
        navigate(`/checkout/${savedOrder?._id}/confirmation`);
        return;
      }

      const paymentResponse = await fetch(
        "http://localhost:3005/vnpay/create_payment_url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            total: totalFee,

            orderInfo: `Payment for Order ${savedOrder._id}`,
            orderId: savedOrder._id,
          }),
        }
      );

      const paymentResult = await paymentResponse.json();

      if (paymentResult.paymentUrl) {
        window.location.href = paymentResult.paymentUrl;
      } else {
        setSnackbarMessage("Failed to generate payment URL!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
      resetAllData();

      setLoading(false);
    } catch (error) {
      console.error("Error in order submission:", error);
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setLoading(false);
    }
  };
  const handleCardDetailsChange = (field) => (event) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <CheckoutStepper currentStep={3} />

      <Box sx={styles.paymentBox}>
        <Typography sx={styles.title}>Payment Methods</Typography>

        <form onSubmit={handleSubmit}>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <Box sx={styles.paymentOption}>
              <FormControlLabel
                value="cash"
                control={
                  <Radio
                    sx={{
                      color: "#759af9",
                      "&.Mui-checked": {
                        color: "#C8FFF6",
                      },
                    }}
                  />
                }
                label="Pay on Delivery"
                sx={styles.radioLabel}
              />
              <Typography sx={styles.subtext}>
                Pay with cash on delivery
              </Typography>
            </Box>

            <Box sx={styles.paymentOption}>
              <FormControlLabel
                value="vnpay"
                control={
                  <Radio
                    sx={{
                      color: "#759af9",
                      "&.Mui-checked": {
                        color: "#C8FFF6",
                      },
                    }}
                  />
                }
                label="Digital"
                sx={styles.radioLabel}
              />
              <Typography sx={styles.subtext}>
                Pay with your digital bank
              </Typography>
            </Box>
          </RadioGroup>

          <Box sx={styles.buttonContainer}>
            <Button
              onClick={onPreviousStep}
              type="submit"
              variant="contained"
              sx={styles.button}
            >
              Back
            </Button>
            <Button type="submit" variant="contained" sx={styles.button}>
              Complete Order
            </Button>
          </Box>
        </form>
      </Box>
      {loading && (
        <Modal
          onClose={handleCloseModal}
          sx={{ display: "flex", alignItems: "center", alignContent: "center" }}
        >
          <CircularProgress />
        </Modal>
      )}
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
    </Container>
  );
};

export default DesignPaymentPage;
