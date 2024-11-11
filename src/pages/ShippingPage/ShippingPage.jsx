import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Box, IconButton, TextField, Button, Typography } from "@mui/material";
import "./ShippingPage.css";
import { useSelector } from "react-redux";
import ShippingCard from "../../components/shippingCard";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import OrderTab from "../../components/OrderTab/OrderTab";
const ShippingPage = () => {
  const { items } = useSelector((state) => state.cart);

  return (
    <div
      style={{
        display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        // marginLeft: "70px",
        width: "95%",
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          // top: "-30rem",
          left: "1rem",
          color: "#ffffff",
        }}
        onClick={() => {}}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <OrderSummary items={items} />
      <OrderTab checkoutId={items[0]?._id} />
    </div>
  );
};

export default ShippingPage;
