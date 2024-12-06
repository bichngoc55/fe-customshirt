import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Rating,
  Typography,
  Snackbar,
  Alert,
  styled,
  Button,
  Pagination,
  CircularProgress,
} from "@mui/material";
import "./ProductTabs.css";
import BtnComponent from "../btnComponent/btnComponent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import InputForm from "../inputForm/inputForm";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import SizeGuideModal from "../SizeGuideModal";
import ImageSliderModal from "../ImageSliderModal/ImageSliderModal";
const TabPanel = ({ children, value, index }) => {
  return (
    <div className="tab-panel" hidden={value !== index}>
      {value === index && children}
    </div>
  );
};
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const ProductTabs = ({ product, onReviewUpdate }) => {
  const { user } = useSelector((state) => state.auths);
  const [openReview, setOpenReview] = useState(false);
  const [page, setPage] = useState(1);
  const reviewsPerPage = 3;
  const [reviewText, setReviewText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isModalSizeGuideOpen, setIsModalSizeGuideOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // const [selectedImages, setSelectedImages] = useState([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    console.log("review", product.reviews);
  }, []);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };
  const handleImageUpload = async () => {
    setIsUploading(true);

    const uploadedUrls = await Promise.all(
      files.map(async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "domdom");
        formData.append("cloud_name", "dejoc5koc");

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dejoc5koc/image/upload`,
          formData
        );

        return response.data.secure_url;
      })
    );
    // setIsUploading(false);

    return uploadedUrls;
  };

  const handleCloseSizeGuideModal = () => {
    setIsModalSizeGuideOpen(false);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const handleReviewSubmit = async () => {
    try {
      let reviewImage = [];
      if (files.length > 0) {
        reviewImage = await handleImageUpload(files);
      }
      if (user === null) {
        setSnackbarMessage("Please login before submitting");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        return;
      } else {
        console.log(user);
      }
      if (reviewText === "") {
        setSnackbarMessage("Please input a review");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
      }
      if (reviewRating === 0) {
        setSnackbarMessage("Please select a rating");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(
        `http://localhost:3005/shirt/${product._id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewCustomerID: user?._id,
            stars: reviewRating,
            comment: reviewText,
            reviewImage,
            productId: product._id,
          }),
        }
      );
      setIsUploading(false);
      console.log(response);

      if (!response.ok) {
        setSnackbarMessage(
          "You have to buy the product before leaving a review."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
      setIsUploading(false);

      const updatedProduct = await response.json();
      onReviewUpdate(updatedProduct);
      // setProduct(updatedProduct);
      setOpenReview(false);
      setReviewText("");
      setReviewRating(0);
      setFiles([]);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Newly selected files:", files);
    setFiles((prev) => {
      const updatedFiles = [...prev, ...files];
      console.log("Updated files2 state:", updatedFiles);
      return updatedFiles;
    });
  };
  const handleDeleteImage = (index, isExisting) => {
    if (isExisting) {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };
  // page
  const indexOfLastReview = page * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = Array.isArray(product?.reviews)
    ? product.reviews.slice(indexOfFirstReview, indexOfLastReview)
    : [];

  const totalPages = Math.ceil(
    (Array.isArray(product?.reviews) ? product.reviews.length : 0) /
      reviewsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <div className="product-tabs">
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 0 ? "active" : ""}`}
          onClick={() => handleTabChange(0)}
        >
          Description
        </button>
        <button
          className={`tab-button ${activeTab === 1 ? "active" : ""}`}
          onClick={() => handleTabChange(1)}
        >
          Reviews ({product.reviews?.length || 0})
        </button>
      </div>

      <TabPanel value={activeTab} index={0}>
        <div className="description-content">
          {product.description || "No description available."}
        </div>
        <div style={{ marginTop: "20px" }} className="description-content">
          Care Instruction
          <ul>
            <li>Wash at a normal temperature with similar colored items.</li>
            <li>Do not use bleach.</li>
            <li>Can be hand washed or machine washed.</li>
            <li>
              When drying, it is recommended to use a hanger to avoid distorting
              the product.
            </li>
          </ul>
        </div>
        <div
          style={{ marginTop: "20px", display: "flex" }}
          className="description-content"
        >
          Liên hệ tư vấn/ Contact
          <div style={{ marginLeft: "20px" }}>
            <BtnComponent
              handleClick={() => {
                if (user === null) {
                  setSnackbarMessage("Please login to contact us");
                  setSnackbarSeverity("warning");
                  setOpenSnackbar(true);
                  return;
                } else navigate(`/message/${user?._id}`);
              }}
              value={"Start a conversation"}
              width={"300px"}
              height={"300px"}
            />
          </div>
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <div
          style={{
            display: "flex",
            textAlign: "center",
            marginLeft: "-10px",
            marginBottom: "10px",
          }}
        >
          <IconButton onClick={() => setOpenReview(true)}>
            <AddIcon sx={{ color: "#8CFFB3" }} />
          </IconButton>
          <Typography
            mt={"10px"}
            sx={{
              color: "white",
              fontSize: "0.8rem",
              fontFamily: "Montserrat",
            }}
          >
            Add
          </Typography>
        </div>

        {openReview && (
          <div className="review-modal">
            <div style={{ marginBottom: "25px" }}>
              <InputForm
                placeholder="Enter your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                width="800px"
                height="35px"
              />
            </div>
            <div className="review-rating-container">
              <Rating
                name="review-stars"
                value={reviewRating}
                onChange={(e, newValue) => setReviewRating(newValue)}
                size="small"
              />
            </div>
            <div className="review-actions">
              <button
                style={{
                  backgroundColor: "#37C25E",
                  padding: "10px",
                  fontFamily: "Montserrat",
                  marginRight: "10px",
                  color: "white",
                }}
                onClick={handleReviewSubmit}
              >
                Submit
              </button>

              <button
                style={{
                  backgroundColor: "#37C25E",
                  color: "white",
                  marginLeft: "10px",
                  fontFamily: "Montserrat",
                  padding: "10px",
                }}
                onClick={() => setOpenReview(false)}
              >
                Cancel
              </button>

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  color: "white",
                  fontFamily: "Montserrat",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderWidth: "1px",
                  "&:hover": { borderColor: "rgba(255, 255, 255, 0.3)" },
                }}
              >
                Choose Image
                <input
                  multiple
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </Button>
              {isUploading && (
                <div style={{ marginLeft: "10px" }}>
                  <CircularProgress size={24} />
                </div>
              )}
            </div>

            <div
              style={{ marginTop: "10px", display: "flex" }}
              className="review-images"
            >
              {files &&
                files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      margin: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "100px",
                        height: "100px",
                        overflow: "hidden",
                        borderRadius: 1,
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundImage: `url(${URL.createObjectURL(file)})`,
                      }}
                    />
                    <Button
                      onClick={() => handleDeleteImage(index, true)}
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        minWidth: "30px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                        },
                      }}
                    >
                      <CancelIcon sx={{ fontSize: 20 }} />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="reviews-container">
          {product.reviews?.length > 0 ? (
            <>
              {currentReviews?.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <Avatar className="review-avatar">
                      {review.reviewCustomerID?.avaURL || "?"}
                    </Avatar>
                    <div className="review-user-info">
                      <p className="review-username">
                        {review.reviewCustomerID?.name || "Anonymous"}
                      </p>
                      <div className="review-rating">
                        <Rating value={review.stars} readOnly size="small" />
                        <span className="rating-text">{review.stars}/5</span>
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>

                  {review.reviewImage && review.reviewImage.$each && (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {review.reviewImage.$each.map((imageUrl, imageIndex) => (
                        <div
                          key={imageIndex}
                          style={{
                            position: "relative",
                            display: "inline-block",
                            margin: "10px",
                          }}
                        >
                          <Box
                            onClick={() => {
                              setSelectedImageIndex(imageIndex);
                              setIsModalSizeGuideOpen(true);
                            }}
                            sx={{
                              display: "flex",
                              width: "100px",
                              height: "100px",
                              overflow: "hidden",
                              borderRadius: 1,
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundImage: `url(${imageUrl})`,
                            }}
                          />
                        </div>
                      ))}
                      <ImageSliderModal
                        images={review.reviewImage.$each}
                        isOpen={isModalSizeGuideOpen}
                        onClose={handleCloseSizeGuideModal}
                        initialIndex={selectedImageIndex}
                      />
                    </div>
                  )}

                  {index < product.reviews.length - 1 && (
                    <div className="review-divider" />
                  )}
                </div>
              ))}
              {/* Pagination */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  mb: 2,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "rgba(140, 255, 179, 0.2) !important",
                    },
                  }}
                />
              </Box>
            </>
          ) : (
            <div className="no-reviews">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </TabPanel>
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

export default ProductTabs;
