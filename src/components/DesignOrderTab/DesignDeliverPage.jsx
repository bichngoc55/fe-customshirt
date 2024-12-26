import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import CheckoutStepper from "./CheckoutStepper";
import { useDispatch, useSelector } from "react-redux";
import { setDeliveryData } from "../../redux/shippingSlice";

const DesignDeliverPage = ({ price, setPrice, onPreviousStep, onNextStep }) => {
  const { deliveryData } = useSelector((state) => state.shipping);
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryData);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const dispatch = useDispatch();
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  
  const deliveryOptions = [
    {
      id: "standard",
      name: "Standard 5-7 Business Days",
      price: "FREE",
      style: { color: "#4ADE80" },
    },
    {
      id: "express",
      name: "2-4 Business Days",
      price: "+15.000",
      style: { color: "white" },
    },
    {
      id: "same-day",
      name: "Same day delivery",
      price: "+75.000",
      style: { color: "white" },
    },
  ];

  const styles = {
    container: {
      minHeight: "100vh",
      //   backgroundColor: "#1A1B1E",
      padding: "24px",
    },
    deliveryBox: {
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
    option: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "16px 0",
    },
    radioLabel: {
      color: "white",
      fontSize: "18px",
      "&.Mui-checked": {
        color: "#C8FFF6",
      },
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
      marginRight: "16px",
      "&:hover": {
        backgroundColor: "#3FCC73",
      },
    },
    price: {
      fontSize: "18px",
      fontWeight: "500",
      marginLeft: "24px",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDelivery) {
      setSnackbarMessage("Please select a delivery");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    // localStorage.setItem("deliveryOption", selectedDelivery);
    dispatch(setDeliveryData(selectedDelivery));
    onNextStep();
  };

  const handleDeliveryChange = (event) => {
    setSelectedDelivery(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <CheckoutStepper currentStep={2} />

      <Box sx={styles.deliveryBox}>
        <Typography sx={styles.title}>Delivery Options</Typography>

        <form onSubmit={handleSubmit}>
          <RadioGroup value={selectedDelivery} onChange={handleDeliveryChange}>
            {deliveryOptions.map((option) => (
              <Box key={option.id} sx={styles.option}>
                <FormControlLabel
                  value={option.id}
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
                  label={option.name}
                  sx={styles.radioLabel}
                />
                <Typography sx={{ ...styles.price, ...option.style }}>
                  {option.price}
                </Typography>
              </Box>
            ))}
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
              Continue
            </Button>
          </Box>
        </form>
      </Box>
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

export default DesignDeliverPage;
