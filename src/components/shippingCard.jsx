import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useDispatch, useSelector } from "react-redux";
const ShippingCard = ({ items }) => {
  // const [quantity, setQuantity] = useState(1);
  // const { user } = useSelector((state) => state.auths);
  // const dispatch = useDispatch();

  const calculateSalePrice = (product) => {
    if (product.isSale) {
      return product.price * (1 - product.salePercent / 100);
    }
    return product.price;
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
        {items.map((item) => (
          <div
            key={item._id}
            className="order-item"
            style={{
              backgroundColor: "#131720",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={
                  item.product.imageUrl && item.product.imageUrl.length > 1
                    ? item.selectedColor === "white"
                      ? item.product.imageUrl[1]
                      : item.product.imageUrl[0]
                    : ".jpg"
                }
                alt={item.product.name}
              />
              <div>
                <h3 style={{ marginLeft: "10px" }}>{item.product.name}</h3>
                <span
                  style={{
                    color: "white",
                    fontSize: "1rem",
                    marginLeft: "15px",
                  }}
                  className="quantity-display"
                >
                  x{item.quantity}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              {item.product.salePercent ? (
                <>
                  <span
                    style={{
                      fontFamily: "Montserrat",
                      color: "#C8FFF6",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {(
                      calculateSalePrice(item.product) * item.productQuantity
                    ).toLocaleString()}
                    đ
                  </span>
                  <span className="original-price">{item.product.price}đ</span>
                </>
              ) : (
                <span>{item.product.price}đ</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ShippingCard;
