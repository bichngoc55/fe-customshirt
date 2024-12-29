import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import "./DesignShippingPage.css";
import DesignOrderSummary from "../../components/DesignOrderSummary/DesignOrderSummary";
import DesignOrderTab from "../../components/DesignOrderTab/DesignOrderTab";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDesign } from "../../redux/designSlice";

const DesignShippingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //   const design = location.state?.design;
  const { currentDesign } = useSelector((state) => state.design);

  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("S");
  const dispatch = useDispatch();
 
  useEffect(() => {
    if (location.state?.design) {
      dispatch(setCurrentDesign(location.state.design));
      console.log("Design", currentDesign);
    }
  }, [location.state, dispatch]);
  if (!currentDesign) {
    return <div>Design not found</div>;
  }
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
          left: "1rem",
          color: "#ffffff",
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <DesignOrderSummary
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        quantity={quantity}
        setQuantity={setQuantity}
        price={price}
        setPrice={setPrice}
        design={currentDesign}
      />
      <DesignOrderTab
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        quantity={quantity}
        setQuantity={setQuantity}
        price={price}
        setPrice={setPrice}
        design={currentDesign}
      />
    </div>
  );
};

export default DesignShippingPage;
