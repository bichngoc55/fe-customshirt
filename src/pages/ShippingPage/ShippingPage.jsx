import React, { useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import "./ShippingPage.css";
import { useSelector } from "react-redux";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import OrderTab from "../../components/OrderTab/OrderTab";
const ShippingPage = () => {
  const { orderDetails } = useSelector((state) => state.orderDetails);
  useEffect(() => {
    console.log(orderDetails);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "95%",
        marginBottom: "100px",
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          // top: "-30rem",
          left: "1rem",
          color: "#ffffff",
        }}
        onClick={() => window.history.back()}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <OrderSummary items={orderDetails} />
      <OrderTab checkoutId={orderDetails[0]?._id} />
    </div>
  );
};

export default ShippingPage;
