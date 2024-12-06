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

const PaymentPage = ({ onPreviousStep, onNextStep }) => {
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
  const { selectedItems } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState(paymentData || "cash");
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
  const calculateSalePrice = (product) => {
    if (product.isSale) {
      return product.price * (1 - product.salePercent / 100);
    }
    return product.price;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation checks
      if (!selectedItems || selectedItems.length === 0) {
        throw new Error("No items in cart");
      }

      // if (!user?._id) {
      //   throw new Error("User not authenticated");
      // }

      if (!shippingData) {
        throw new Error("Shipping information is missing");
      }

      const paymentData = {
        method: paymentMethod,
        ...(paymentMethod === "card" && { cardDetails }),
      };

      if (paymentData.method === null) {
        throw new Error("Please select a payment method to purchase");
      }

      const formattedPaymentData = {
        method: paymentMethod === "card" ? "Credit_Card" : "Cash",
        status: "pending",
        ...(paymentMethod === "card" && {
          cardExpirationDate: new Date(cardDetails.expiry),
          transactionId: generateTransactionId(),
          last4Digits: cardDetails.cardNumber.slice(-4),
          cardBrand: detectCardType(cardDetails.cardNumber),
          paidAt: new Date(),
        }),
      };

      const orderDetails = await Promise.all(
        selectedItems.map(async (item) => {
          if (!item?.product?._id) {
            throw new Error("Invalid product information");
          }

          const orderDetail = {
            itemType: "store",
            product: item.product._id,
            productSize: item.selectedSize,
            productColor: item.selectedColor,
            productPrice: item.quantity * calculateSalePrice(item.product),
            productQuantity: item.quantity,
          };

          const response = await fetch(
            "http://localhost:3005/orderDetails/add",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderDetail),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to create order detail");
          }

          const data = await response.json();
          return data._id;
        })
      );

      const order = {
        userInfo: {
          userId: user?._id,
          name: shippingData.name,
          phone: shippingData.phone,
          email: shippingData.email,
        },
        items: orderDetails,
        voucherId: {
          discount: voucherData?.discount,
          code: voucherData?.code,
        },
        deliveryDate: calculateDeliveryDate(deliveryData),
        total: totalFee,
        shippingFee: shippingFee,
        shippingMethod: deliveryData,
        paymentDetails: formattedPaymentData,
        billingAddress: {
          province: shippingData.province,
          district: shippingData.district,
          details: shippingData.address,
        },
      };

      const orderResponse = await fetch("http://localhost:3005/order/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.msg || "Failed to create order");
      }

      setLoading(false);
      resetAllData();
      navigate(`/checkout/${selectedItems[0]._id}/confirmation`);
    } catch (error) {
      console.error("Error in order submission:", error);
      setSnackbarMessage(error.message || "Failed to process order");
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel
                  value="card"
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
                  label="Credit/Debit Cards"
                  sx={styles.radioLabel}
                />
                <Box sx={styles.cardLogos}>
                  <IconButton>
                    <FaCcVisa style={styles.cardLogo} />
                  </IconButton>
                  <IconButton>
                    <FaCcMastercard style={styles.cardLogo} />
                  </IconButton>
                </Box>
              </Box>
              <Typography sx={styles.subtext}>
                Pay with your Credit / Debit Card
              </Typography>

              {paymentMethod === "card" && (
                <Box sx={styles.cardForm}>
                  <StyledTextField
                    fullWidth
                    placeholder="Card number"
                    value={cardDetails.cardNumber}
                    onChange={handleCardDetailsChange("cardNumber")}
                  />
                  <Box sx={styles.row}>
                    <StyledTextField
                      placeholder="MM / YY"
                      value={cardDetails.expiry}
                      onChange={handleCardDetailsChange("expiry")}
                      sx={{ width: "50%" }}
                    />
                    <StyledTextField
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={handleCardDetailsChange("cvv")}
                      type="password"
                      sx={{ width: "50%" }}
                    />
                  </Box>
                  <StyledTextField
                    fullWidth
                    placeholder="Card holder name"
                    value={cardDetails.cardHolder}
                    onChange={handleCardDetailsChange("cardHolder")}
                  />
                </Box>
              )}
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

export default PaymentPage;
