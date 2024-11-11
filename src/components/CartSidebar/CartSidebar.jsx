import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import "./CartSidebar.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { FontWeight } from "@cloudinary/url-gen/qualifiers";
const CartSidebar = ({ open, onClose, setCartItems }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auths);
  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [cartTotalItems, setCartTotalItems] = useState(0);

  useEffect(() => {
    if (user && open) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user, open]);

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart({ userId: user._id, itemId: item._id }));
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(
      updateQuantity({
        userId: user._id,
        itemId: item._id,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({
          userId: user._id,
          itemId: item._id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart(user._id));
  };
  useEffect(() => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    setCartTotalItems(totalItems);
  }, [items]);
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item.product.salePercent
        ? calculateSalePrice(item.product)
        : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };
  const calculateSalePrice = (product) => {
    if (product.isSale) {
      return product.price * (1 - product.salePercent / 100);
    }
    return product.price;
  };
  const handleBuyNow = async () => {
    if (items[0]?._id) {
      navigate(`/checkout/${items[0]?._id}/shipping`);
      onClose();
    } else {
      console.error("Cart item ID is missing");
    }
  };
  const handleShopNow = () => {
    navigate("/collection");
    onClose();
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className="cart-drawer"
    >
      <Box className="cart-container">
        <div className="cart-header">
          <Typography sx={{ fontSize: "20px" }}>
            {" "}
            Giỏ hàng của bạn ({cartTotalItems})
          </Typography>
          <div className="cart-header-actions">
            {items.length > 0 && (
              <Button onClick={handleClearCart} className="clear-cart-button">
                Xóa tất cả
              </Button>
            )}
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        <Divider />

        {items.length === 0 ? (
          <div className="empty-cart">
            <Typography variant="body1">Giỏ hàng của bạn đang trống</Typography>
            <Button
              sx={{ backgroundColor: "#131720", color: "white" }}
              onClick={handleShopNow}
              className="continue-shopping-button"
            >
              Shop Now
            </Button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item._id} className="cart-item">
                  <img
                    src={
                      item.product.imageUrl && item.product.imageUrl.length > 1
                        ? item.selectedColor === "white"
                          ? item.product.imageUrl[1]
                          : item.product.imageUrl[0]
                        : ".jpg"
                    }
                    alt={item.product.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-details">
                    <div className="item-info">
                      <Typography
                        className="item-name"
                        sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                      >
                        {item.product.name}
                      </Typography>
                      <Typography
                        className="cart-item-size"
                        sx={{ fontFamily: "Montserrat" }}
                      >
                        {item.selectedSize} | {item.selectedColor}
                      </Typography>
                      <div className="price-container">
                        {item.product.salePercent ? (
                          <>
                            <span className="original-price">
                              {item.product.price}đ
                            </span>
                            <span
                              style={{
                                color: "#ef4444",
                                fontSize: "20px",
                                FontWeight: "500",
                                marginRight: "0.5rem",
                              }}
                              className=""
                            >
                              {calculateSalePrice(
                                item.product
                              ).toLocaleString()}
                              đ
                            </span>
                          </>
                        ) : (
                          <span>{item.product.price}đ</span>
                        )}
                      </div>
                      <span className="discount">
                        ({item.product.salePercent}% Off)
                      </span>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <IconButton
                          size="small"
                          onClick={() => handleDecreaseQuantity(item)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <span className="quantity-display">
                          {item.quantity}
                        </span>
                        <IconButton
                          size="small"
                          onClick={() => handleIncreaseQuantity(item)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </div>

                      <IconButton
                        className="delete-button"
                        onClick={() => handleRemoveFromCart(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary">
                <div className="summary-row">
                  <Typography>Temporary charge:</Typography>
                  <Typography>{calculateTotal().toLocaleString()}đ</Typography>
                </div>
                {/* <div className="summary-row">
                  <Typography>Shipping fee:</Typography>
                  <Typography>Miễn phí</Typography>
                </div> */}
                <Divider className="summary-divider" />
                <div className="summary-row total">
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6" color="primary">
                    {calculateTotal().toLocaleString()}đ
                  </Typography>
                </div>
              </div>
              <Button
                onClick={handleBuyNow}
                fullWidth
                className="checkout-button"
              >
                Pay now
              </Button>
            </div>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartSidebar;
