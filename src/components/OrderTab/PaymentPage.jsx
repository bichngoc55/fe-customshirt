import React, { useState } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";

import { styled } from "@mui/material/styles";
import CheckoutStepper from "./CheckoutStepper";

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

const PaymentPage = ({ onNextStep }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolder: "",
  });

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
      fontSize: "16px",
      borderRadius: "8px",
      "&:hover": {
        backgroundColor: "#3FCC73",
      },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save payment details (in a real app, you'd want to use a payment processor)
    const paymentData = {
      method: paymentMethod,
      ...(paymentMethod === "card" && { cardDetails }),
    };
    localStorage.setItem("paymentData", JSON.stringify(paymentData));
    onNextStep();
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
                  {/* 
                  <img
                    src="/api/placeholder/32/32"
                    alt="Visa"
                    style={styles.cardLogo}
                  />
                  <img
                    src="/api/placeholder/32/32"
                    alt="Mastercard"
                    style={styles.cardLogo}
                  /> */}
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
            <Button type="submit" variant="contained" sx={styles.button}>
              Complete Order
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default PaymentPage;
