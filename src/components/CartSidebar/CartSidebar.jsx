import React, { useEffect } from "react";
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
const CartSidebar = ({ open, onClose, setCartItems }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auths);
  const { items } = useSelector((state) => state.cart);

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

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className="cart-drawer"
    >
      <Box className="cart-container">
        <div className="cart-header">
          <Typography variant="h6">
            Giỏ hàng của bạn ({items.length})
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
              variant="contained"
              color="primary"
              onClick={onClose}
              className="continue-shopping-button"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <>
            <List className="cart-items">
              {items.map((item) => (
                <ListItem key={item.id} className="cart-item">
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
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            className="cart-item-size"
                          >
                            Size: {item.selectedSize}
                          </Typography>
                          <Typography
                            component="span"
                            className="cart-item-size"
                          >
                            Colors: {item.selectedColor}
                          </Typography>
                          <Typography
                            component="span"
                            className="cart-item-price"
                          >
                            {item.product.salePercent ? (
                              <>
                                <span className="sale-price">
                                  {calculateSalePrice(
                                    item.product
                                  ).toLocaleString()}
                                  đ
                                </span>
                                <span className="original-price">
                                  {item.product.price}đ
                                </span>
                              </>
                            ) : (
                              <span>{item.product.price}đ</span>
                            )}
                          </Typography>
                        </React.Fragment>
                      }
                    />

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
                        edge="end"
                        className="delete-button"
                        onClick={() => handleRemoveFromCart(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>

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
              <Button fullWidth className="checkout-button">
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
