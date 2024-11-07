import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Badge,
  RadioGroup,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Radio,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import {
  Remove as MinusIcon,
  Add as PlusIcon,
  Facebook as FacebookIcon,
  Pinterest as PinterestIcon,
  LocalShipping as ShippingIcon,
  EmojiEvents as QualityIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import CartSidebar from "../../components/CartSidebar/CartSidebar";
import "./TShirtDetails.css";

import NotifyMessage from "../../components/NotifyMessage";
import ModalUpdateProduct from "../../components/ModalUpdateProduct/ModalUpdateProduct";
import ModalDeleteConfirm from "../../components/ModalDeleteConfirm/ModalDeleteConfirm";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import ProductTabs from "../../components/ProductTabs/ProductTabs";
import SizeGuideModal from "../../components/SizeGuideModal";
// const TabContext = React.createContext();

const TShirtDetails = () => {
  const { state } = useLocation();
  const { product: initialProduct } = state;
  const [product, setProduct] = useState(initialProduct);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // const [image, setImage] = useState(product.imageUrl);
  const [selectedSize, setSelectedSize] = useState("S");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [updatedProduct, setUpdateProduct] = useState(null);
  const { token, user } = useSelector((state) => state.auths);
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState("");
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [voucherCode, setVoucherCode] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [copied, setCopied] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [isModalSizeGuideOpen, setIsModalSizeGuideOpen] = useState(false);

  const handleCopyToClipboard = (voucherCode) => {
    navigator.clipboard
      .writeText(voucherCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };
  // fetch voucher
  useEffect(() => {
    const fetchVoucherCode = async () => {
      try {
        const response = await fetch("http://localhost:3005/voucher");
        const { data } = await response.json();
        // console.log("voucher code:", data);
        setVoucherCode(data);
      } catch (e) {
        console.error("Error:", e);
      }
    };

    fetchVoucherCode();
  }, []);
  // fetch recent viewed products
  useEffect(() => {
    const addAndFetchRecentProducts = async () => {
      try {
        console.log("user Id , productId", user?._id, product?._id);
        await fetch("http://localhost:3005/user/recentProduct", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user?._id, productId: product?._id }),
        });

        const response = await fetch(
          `http://localhost:3005/user/recentProduct/${user._id}`
        );
        const data = await response.json();
        console.log("recent viewed: ", data);
        // console.log("recent viewed: ", shirtId);
        setRecentProducts(data.map((t) => t.shirtId));
      } catch (e) {
        console.error("Error:", e);
      }
    };

    addAndFetchRecentProducts();
  }, [user._id, product._id, token]);
  const handleOpenSizeGuideModal = async () => {
    // open modal
    setIsModalSizeGuideOpen(true);
  };
  const handleCloseSizeGuideModal = () => {
    // close modal
    setIsModalSizeGuideOpen(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const showAuthenticationMessage = () => {
    setSnackbarMessage("Please login to continue");
    setSnackbarSeverity("warning");
    setOpenSnackbar(true);
  };

  // handle Delete
  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/shirt/${product._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsOpenDeleteModal(false);
        setProduct(null);
        setSnackbarMessage("Product deleted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        navigate("/collection/");
      } else {
        console.error("Failed to delete a product");
      }
    } catch (e) {
      console.error("Error deleting product:", e);
    }
  };
  const handleClearSelection = async () => {
    setSelectedSize("");
    setSelectedColor("");
    setSelectedVoucher("");
  };
  // Handle Update
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      console.log(updatedProduct);
      const response = await fetch(
        `http://localhost:3005/shirt/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setProduct(updatedData);
        setIsOpenUpdateModal(false);
        setUpdateProduct(response.data);
        setSnackbarMessage("Product updated successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        console.error("Failed to update product");
      }
    } catch (e) {
      console.error("Error updating product:", e);
    }
  };
  // Calculate the sale price
  const calculateSalePrice = () => {
    if (product.isSale) {
      return product.price * (1 - product.salePercent / 100);
    }
    return product.price;
  };

  const salePrice = calculateSalePrice();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.imageUrl.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [product.imageUrl.length]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.imageUrl.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.imageUrl.length - 1 ? 0 : prevIndex + 1
    );
  };
  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const handleModalUpdateOpenClick = () => {
    console.log(isOpenUpdateModal);
    setIsOpenUpdateModal(true);
  };
  const handleOpenModalDeleteClick = () => {
    setIsOpenDeleteModal(true);
  };

  const handleAddToCart = () => {
    if (!token) {
      showAuthenticationMessage();
      return;
    }
    if (selectedColor !== "white" && selectedColor !== "black") {
      setSnackbarMessage("Please select color");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    if (selectedSize === null) {
      setSnackbarMessage("Please select size");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    const newItem = {
      productId: product?._id,
      quantity,
      userId: user?._id,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
      salePrice,
    };
    console.log("newItem: ", newItem);
    dispatch(addToCart(newItem));
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!token) {
      showAuthenticationMessage();
      return;
    }
    handleAddToCart();
  };

  const renderBadges = (product) => {
    return (
      <div className="product-badge-container">
        {product.isSale && <div className="product-badge badge-sale">Sale</div>}
        {product.isNew && <div className="product-badge badge-new">New</div>}
      </div>
    );
  };
  return (
    <div className="body">
      <div className="path-container">
        <div style={{ marginLeft: "30px" }} className="path-text">
          Home /
        </div>
        <div className="path-text">Collection /</div>
        <div style={{ color: "#8F6600" }} className="path-text">
          {product.name}
        </div>
      </div>

      <Box sx={{ g: 2, ml: "10%", mr: "10%" }}>
        <div
          style={{ display: "flex", marginBottom: "-20px" }}
          className="update-container"
        >
          <div className="" style={{ display: "flex" }}>
            <IconButton onClick={handleModalUpdateOpenClick}>
              <AutoFixHighOutlinedIcon sx={{ color: "#8CFFB3" }} />
            </IconButton>
            <Typography
              mt={"10px"}
              sx={{
                color: "white",
                fontSize: "0.8rem",
                fontFamily: "Montserrat",
              }}
            >
              Update
            </Typography>
            {isOpenUpdateModal && (
              <ModalUpdateProduct
                isModalOpen={isOpenUpdateModal}
                setIsModalOpen={setIsOpenUpdateModal}
                handleUpdateProduct={handleUpdateProduct}
                setUpdateProduct={setUpdateProduct}
                product={product}
              />
            )}
          </div>

          <div className="" style={{ display: "flex" }}>
            <IconButton onClick={handleOpenModalDeleteClick}>
              <DeleteIcon sx={{ color: "#8CFFB3" }} />
            </IconButton>
            <Typography
              mt={"10px"}
              sx={{
                color: "white",
                fontSize: "0.8rem",
                fontFamily: "Montserrat",
                // textAlign: "center",
              }}
            >
              Delete
            </Typography>
            {isOpenDeleteModal && (
              <ModalDeleteConfirm
                isOpenModal={isOpenDeleteModal}
                setOpenModal={setIsOpenDeleteModal}
                handleDeleteProduct={handleDeleteProduct}
                handleCloseDeleteModal={handleCloseDeleteModal}
              />
            )}
          </div>
        </div>
        <div className="grid-container">
          {/* Product Image Slider */}
          <div className="image-slider">
            <button className="slider-button prev" onClick={handlePrevImage}>
              <ChevronLeftIcon />
            </button>
            <Badge
              badgeContent="Sale"
              color="secondary"
              sx={{ marginLeft: "20px", marginTop: "-5px", fontSize: "1.2rem" }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            />

            <img
              src={product.imageUrl[currentImageIndex]}
              alt={product.name}
              className="product-image"
            />
            <Badge
              badgeContent="New"
              color="primary"
              sx={{
                // marginLeft: "20px",
                marginTop: "40px",
                backgroundColor: "red",
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            />
            <button className="slider-button next" onClick={handleNextImage}>
              <ChevronRightIcon />
            </button>
            <div className="image-dots">
              {product.imageUrl.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <h1
              style={{ color: "#FFD057", margin: 0 }}
              className="product-title"
            >
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="price-section">
              <span className="sale-amount">{salePrice.toLocaleString()}đ</span>
              {product.isSale && (
                <span className="original-price">
                  {product.price.toLocaleString()}đ
                </span>
              )}
              {product.isSale && (
                <>
                  <span className="sale-price">-{product.salePercent}%</span>
                </>
              )}
            </div>
            {product.isSale && (
              <>
                <div className="discount-badge">
                  (Tiết kiệm {(product.price - salePrice).toLocaleString()}đ)
                </div>
              </>
            )}
            {/* Color Selection */}
            <div className="color-selection">
              <p>
                {" "}
                <span style={{ color: "#C8FFF6", fontSize: "1rem" }}>
                  Màu sắc:{" "}
                </span>{" "}
                <span style={{ color: "white", fontSize: "1rem" }}>
                  {selectedColor}
                </span>
              </p>
              <RadioGroup
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                sx={{ display: "flex", gap: "4", flexDirection: "row" }}
                className="radio-group"
              >
                {product.color.map((c) => {
                  return (
                    <Radio
                      key={c}
                      value={c}
                      sx={{
                        color: c === "black" ? "#ffffff" : c,
                        width: "20px",
                        marginRight: "20px",
                        "&.Mui-checked": {
                          color: c === "black" ? "#000000" : "#ffffff",
                        },
                      }}
                    />
                  );
                })}
              </RadioGroup>
            </div>
            {/* voucher code */}
            <div className="voucher-section">
              <span
                style={{
                  color: "#C8FFF6",
                  fontSize: "1rem",
                  marginLeft: "-20px",
                }}
              >
                Voucher code:
              </span>{" "}
              <span
                style={{ color: "white", fontSize: "1rem", marginLeft: "10px" }}
              >
                {selectedVoucher}
              </span>
            </div>
            <div className="voucher-input">
              {voucherCode.map((voucher) => (
                <Button
                  key={voucher.code}
                  sx={{
                    color: "white",
                    fontSize: "1rem",
                    marginLeft: "10px",
                    padding: "5px 15px",
                    borderRadius: "5px",
                    border: "1px solid white",
                    backgroundColor: "#151A27",
                  }}
                  onClick={() => {
                    handleCopyToClipboard(voucher.code);
                    setSelectedVoucher(voucher.code);
                  }}
                >
                  {voucher.code}
                </Button>
              ))}
              {copied && <p style={{ color: "green" }}>Voucher code copied!</p>}
            </div>
            <div className="clear-section">
              <IconButton onClick={handleClearSelection}>
                <RestartAltOutlinedIcon sx={{ color: "#C8FFF6" }} />
              </IconButton>
              <p style={{ color: "#C8FFF6" }}>Clear selection</p>
            </div>
            {/* Size Selection */}
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
                  isOpen={isModalSizeGuideOpen}
                  onClose={handleCloseSizeGuideModal}
                />
              </div>
              <div className="size-buttons">
                {product.size.map((size) => (
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

            {/* Quantity and Add to Cart */}
            <div className="quantity-section">
              {/* <p>Số lượng:</p> */}
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
              <Button
                sx={{ backgroundColor: "white", color: "black" }}
                className="cart-button"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
              {/* <Button className="" sx={{ backgroundColor: "white", color: "black" }}>
                Sửa
              </Button> */}
            </div>

            <Button
              sx={{
                color: "white",
                backgroundColor: "var(--button-color)",
                "&:hover": {
                  backgroundColor: "#4DDA75",
                },
              }}
              className="buy-button"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>

            {/* Shipping and Social */}
            <div className="footer-section">
              <div className="shipping-info">
                <div>
                  <IconButton>
                    <ShippingIcon
                      sx={{
                        color: "#FFD057",
                        padding: "5px",
                      }}
                    />{" "}
                  </IconButton>
                  <span style={{ color: "#C8FFF6", fontWeight: "bold" }}>
                    Giao Hàng Toàn Quốc
                  </span>
                </div>
                <div>
                  <IconButton>
                    <QualityIcon
                      sx={{
                        color: "#FFD057",
                        padding: "5px",
                      }}
                    />{" "}
                  </IconButton>
                  <span style={{ color: "#C8FFF6", fontWeight: "bold" }}>
                    Cam Kết Chất Lượng
                  </span>
                </div>
              </div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: "15px",
                  marginTop: "-17px",
                }}
              >
                <span style={{ color: "#C8FFF6", fontWeight: "bold" }}>
                  Chia sẻ
                </span>
                <div className="social-buttons">
                  <IconButton>
                    <FacebookIcon sx={{ color: "#5890FF" }} />
                  </IconButton>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </Box>
      {/* description and review display tab */}
      <Box sx={{ g: 2, ml: "10%", mr: "10%" }}>
        <ProductTabs product={product} />
      </Box>

      {/* Recently Viewed Products */}
      <Box sx={{ mt: 4, mx: "10%" }}>
        <div className="divider-line"></div>
        <div className="recent-products-container">
          <h2 className="recent-products-title">Recently Viewed Products</h2>
          {recentProducts && recentProducts.length > 0 ? (
            recentProducts.map((recentProduct) => (
              <div key={recentProduct.id} className="products-grid">
                <button className="nav-button nav-button-prev">
                  <ChevronLeftIcon />
                </button>
                <div className="product-card">
                  {renderBadges(recentProduct)}
                  <div className="product-image-container">
                    {recentProduct.imageUrl.map((image, index) => (
                      <img
                        key={index}
                        src={recentProduct.imageUrl[0]}
                        alt={`${recentProduct.name} image ${index + 1}`}
                        className="product-image"
                      />
                    ))}
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{recentProduct.name}</h3>
                    <div className="product-price">
                      {recentProduct.salePrice ? (
                        <>
                          <span className="original-price">
                            ${recentProduct.price}
                          </span>
                          <span className="sale-price">
                            ${recentProduct.salePrice}
                          </span>
                        </>
                      ) : (
                        <span>${recentProduct.price}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="nav-button nav-button-next">
                  <ChevronRightIcon />
                </button>
              </div>
            ))
          ) : (
            <div style={{ color: "white", textAlign: "center" }}>
              No recently viewed products
            </div>
          )}
        </div>
      </Box>

      <CartSidebar
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
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
    </div>
  );
};

export default TShirtDetails;
