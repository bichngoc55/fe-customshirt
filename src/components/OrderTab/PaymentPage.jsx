import React, { useState } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Modal,
  Button,
  Snackbar,
  Container,
  Alert,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { resetShippingState } from "../../redux/shippingSlice";
import { useNavigate } from "react-router-dom";
import CheckoutStepper from "./CheckoutStepper";
import { calculateDeliveryDate } from "../../utils/orderUtils";

const PaymentPage = ({ onPreviousStep }) => {
  const { shippingData, deliveryData, totalFee, shippingFee, voucherData } =
    useSelector((state) => state.shipping);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useSelector((state) => state.auths);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const dispatch = useDispatch();
  const { selectedItems } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("vnpay");

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

  const resetAllData = () => {
    dispatch(resetShippingState());
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
      if (!selectedItems || selectedItems.length === 0) {
        throw new Error("No items in cart");
      }
      if (!shippingData) {
        throw new Error("Shipping information is missing");
      }

      // Prepare order details
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

      const initialOrderData = {
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
      // console.log("Saved order: ", savedOrder);
 
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

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", padding: "24px" }}>
      <CheckoutStepper currentStep={3} />

      <Box
        sx={{
          borderRadius: "15px",
          border: "1px solid #759af9",
          padding: "32px",
          marginTop: "38px",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <Typography
          sx={{
            color: "#C8FFF6",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "32px",
          }}
        >
          Payment Methods
        </Typography>

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

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "32px",
            }}
          >
            <Button
              onClick={onPreviousStep}
              variant="contained"
              sx={{
                backgroundColor: "#4ADE80",
                color: "black",
                padding: "12px 32px",
                marginRight: "16px",
                fontSize: "16px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#3FCC73",
                },
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#4ADE80",
                color: "black",
                padding: "12px 32px",
                fontSize: "16px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#3FCC73",
                },
              }}
            >
              Complete Order
            </Button>
          </Box>
        </form>
      </Box>

      {loading && (
        <Modal
          open={loading}
          onClose={() => setLoading(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
