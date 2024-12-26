import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, IconButton, Radio, RadioGroup } from "@mui/material";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SizeGuideModal from "../SizeGuideModal";
import "./DesignOrderCard.css";
import sizeguide from "../../assets/images/sizeguide.png";
import noImg from "../../assets/images/no_img.jpeg";

import { Remove as MinusIcon, Add as PlusIcon } from "@mui/icons-material";
const sizes = ["S", "M", "L", "XL", "XXL"];
const DesignOrderCard = ({
  quantity,
  setQuantity,
  selectedSize,
  setSelectedSize,
  setPrice,
  design,
}) => {
  //   const [selectedSize, setSelectedSize] = useState("S");
  const [isModalSizeGuideOpen, setIsModalSizeGuideOpen] = useState(false);

  const calculateDesignPrice = async () => {
    const baseShirtPrice = 70000;
    const laborCost = 14000;
    const locationFee = 10000;
    const desiredProfit = 20000;
    const pricePerSizeIncrease = 3000;
    const pricePerSquareMeter = 100000;

    let sizeSurcharge = 0;
    const sizeIndex = sizes.indexOf(selectedSize);
    if (sizeIndex > 0) {
      sizeSurcharge = sizeIndex * pricePerSizeIncrease;
    }

    let printArea = 0;
    if (design.elements) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      await design.elements.forEach((element) => {
        if (element.type === "shape" && element.properties.points) {
          element.properties.points.forEach((point) => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
          });
        } else if (element.type === "text" && element.properties.position) {
          const { x, y } = element.properties.position;
          const width = element.properties.width || 0;
          const height = element.properties.height || 0;

          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x + width);
          maxY = Math.max(maxY, y + height);
        } else if (element.type === "stickers" && element.properties.position) {
          const { x, y } = element.properties.position;
          const width = element.properties.width || 0;
          const height = element.properties.height || 0;

          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x + width);
          maxY = Math.max(maxY, y + height);
        }
      });
      const pixelsToMeters = 1 / (300 * 39.37);
      const width = (maxX - minX) * pixelsToMeters;
      const height = (maxY - minY) * pixelsToMeters;
      printArea = width * height;
    }

    const printingCost = printArea * pricePerSquareMeter;

    const totalPrice =
      baseShirtPrice +
      laborCost +
      locationFee +
      desiredProfit +
      sizeSurcharge +
      printingCost;
    setPrice(Math.round(totalPrice));
    return Math.round(totalPrice);
  };
  const handleOpenSizeGuideModal = async () => {
    setIsModalSizeGuideOpen(true);
  };
  const handleCloseSizeGuideModal = () => {
    setIsModalSizeGuideOpen(false);
  };
  const handleClearSelection = () => {
    setSelectedSize("");
  };
  const getImageSrc = (base64String) => {
    if (base64String && typeof base64String === "string") {
      return base64String.startsWith("data:image/")
        ? base64String
        : `data:image/octet-stream;base64,${base64String}`;
    }
    return noImg;
  };
  return (
    <Card
      sx={{
        minWidth: 275,
        backgroundColor: "#131720",
        margin: "0px",
        padding: "-10px",
      }}
    >
      <CardContent sx={{ padding: "0px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            color: "white",
          }}
        >
          <h3 style={{ marginLeft: "10px" }}>{design?.name}</h3>
        </div>
        <div
          className="design-item"
          style={{
            backgroundColor: "#131720",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={getImageSrc(design?.previewImage)}
              alt={`Design ${design?._id}`}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                fontFamily: "Montserrat",
                color: "#C8FFF6",
                fontSize: "1.2rem",
                fontWeight: "bold",
                display: "none",
              }}
            >
              {(calculateDesignPrice(design) * quantity).toLocaleString()}đ
            </span>
          </div>
        </div>
      </CardContent>
      <div className="size-section">
        <div className="size-header">
          <p>
            {" "}
            <span
              style={{
                color: "#C8FFF6",
                fontSize: "1rem",
                marginRight: "5px",
              }}
            >
              Size:
            </span>{" "}
            <span style={{ color: "white", fontSize: "1rem" }}>
              {selectedSize}
            </span>
          </p>
          {/* <BtnComponent value={"Size guide"} /> */}
          <div className="size-guide" onClick={handleOpenSizeGuideModal}>
            Hướng dẫn chọn size
          </div>
          <SizeGuideModal
            image={sizeguide}
            isOpen={isModalSizeGuideOpen}
            onClose={handleCloseSizeGuideModal}
          />
        </div>
        <div className="size-buttons">
          {sizes.map((size) => (
            <Button
              key={size}
              sx={{
                color: selectedSize === size ? "black" : "#7E7E7E",
                border: "1px solid #e5e7eb",

                backgroundColor:
                  selectedSize === size ? "white" : "transparent",
              }}
              className="size-button"
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      <div className="clear-section">
        <IconButton onClick={handleClearSelection}>
          <RestartAltOutlinedIcon sx={{ color: "#C8FFF6" }} />
        </IconButton>
        <p style={{ color: "#C8FFF6" }}>Clear selection</p>
      </div>
      <div className="quantity-section">
        <div className="quantity-controls">
          <Button
            className="quantity-button"
            sx={{ color: "white" }}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <MinusIcon />
          </Button>
          <span
            style={{ color: "white", fontSize: "1rem" }}
            className="quantity-display"
          >
            {quantity}
          </span>

          <Button
            className="quantity-button"
            sx={{ color: "white" }}
            onClick={() => setQuantity(quantity + 1)}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DesignOrderCard;
