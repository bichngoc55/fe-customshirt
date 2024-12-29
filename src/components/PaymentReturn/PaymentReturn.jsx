// components/PaymentReturn/PaymentReturn.js
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import "./PaymentReturn.css";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("vnp_TxnRef");
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());

        const response = await fetch(
          "http://localhost:3005/vnpay/update-status",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          }
        );

        const data = await response.json();

        if (data.success) {
          setStatus(params.vnp_ResponseCode === "00" ? "success" : "failed");
          setTimeout(() => {
            navigate(`/checkout/${orderId}/confirmation`);
          }, 3000);
        } else {
          setStatus("failed");
          setTimeout(() => {
            navigate(`/checkout/${orderId}`);
          }, 3000);
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        setStatus("failed");
      }
    };

    updatePaymentStatus();
  }, [searchParams, navigate]);

  return (
    <Container maxWidth="sm" className="payment-return-container">
      <Paper elevation={3} className="payment-return-paper">
        <Box className="payment-return-content">
          {status === "processing" && (
            <>
              <CircularProgress size={60} className="payment-return-progress" />
              <Typography className="payment-return-title">
                Processing your payment...
              </Typography>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleIcon className="payment-return-icon success" />
              <Typography className="payment-return-title success">
                Payment Successful!
              </Typography>
              <Typography className="payment-return-subtitle">
                Redirecting to order confirmation...
              </Typography>
            </>
          )}

          {status === "failed" && (
            <>
              <ErrorIcon className="payment-return-icon error" />
              <Typography className="payment-return-title error">
                Payment Failed
              </Typography>
              <Typography className="payment-return-subtitle">
                Redirecting back to checkout...
              </Typography>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentReturn;
