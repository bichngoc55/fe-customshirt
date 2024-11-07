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
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../../redux/cartSlice";
const CartSidebar = ({ open, onClose, setCartItems }) => {
  const { user } = useSelector((state) => state.auths);
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  //   const [latestItems, setLatestItems] = useState([]);
  useEffect(() => {
    dispatch(fetchCart(user?._id));
    console.log("items loaded: ", items);
  }, [dispatch, , user?._id]);

  const handleRemoveFromCart = (item) => {
    const newItem = {
      productId: item?._id,
      selectedColor: item?.selectedColor,
      selectedSize: item?.selectedSize,
    };
    dispatch(
      removeFromCart({
        id: user?._id,
        newItem,
      })
    ).then(() => {
      dispatch(fetchCart(user?._id));
    });
    console.log("Cart items after loading: ", items);
    // setLatestItems[]
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(
      increaseQuantity({ id: user?._id, productId: item?.product._id })
    ).then(() => {
      dispatch(fetchCart(user?._id));
    });
    console.log("Cart items after loading: ", items);
  };

  const handleDecreaseQuantity = (item) => {
    dispatch(
      decreaseQuantity({ id: user?._id, productId: item?.product._id })
    ).then(() => {
      dispatch(fetchCart(user?._id));
    });
    console.log("Cart items after loading: ", items);
  };

  const handleClearCart = () => {
    dispatch(clearCart({ id: user?._id })).then(() => {
      dispatch(fetchCart(user?._id));
    });
    console.log("Cart items after loading: ", items);
  };
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.salePrice || item.price;
      return total + itemPrice * item.quantity;
    }, 0);
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
                                  {item.product.salePercent}đ
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
                  <Typography>Tạm tính:</Typography>
                  <Typography>{calculateTotal().toLocaleString()}đ</Typography>
                </div>
                <div className="summary-row">
                  <Typography>Phí vận chuyển:</Typography>
                  <Typography>Miễn phí</Typography>
                </div>
                <Divider className="summary-divider" />
                <div className="summary-row total">
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6" color="primary">
                    {calculateTotal().toLocaleString()}đ
                  </Typography>
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className="checkout-button"
              >
                Thanh toán ngay
              </Button>
            </div>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartSidebar;
