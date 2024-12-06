import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Rating,
  Button,
  Collapse,
  Divider,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import InputForm from "./inputForm/inputForm";
import { useSelector } from "react-redux";

const FeedbackSection = ({ feedbacks, isLoading, onFeedbackUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [starFilter, setStarFilter] = useState(null);
  const [stats, setStats] = useState(null);
  const [openReview, setOpenReview] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const { user } = useSelector((state) => state.auths);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3005/feedback/feedbackStats"
      );
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [starFilter]);

  const filteredFeedbacks = feedbacks?.filter((feedback) =>
    starFilter ? feedback.feedbackStar === starFilter : true
  );
  const displayedFeedbacks = expanded
    ? filteredFeedbacks
    : filteredFeedbacks?.slice(0, 3);

  const handleStarFilter = (event, newValue) => {
    setStarFilter(newValue);
  };
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const handleFeedbackSubmit = async () => {
    try {
      if (user === null) {
        setSnackbarMessage("Please login before submitting");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        return;
      } else {
        console.log(user);
      }
      if (feedbackText === "") {
        setSnackbarMessage("Please input a feedback");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
      }
      if (feedbackRating === 0) {
        setSnackbarMessage("Please select a rating");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(`http://localhost:3005/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackCustomerID: user?._id,
          customerEmail: user?.email,
          feedbackStar: feedbackRating,
          feedbackContent: feedbackText,
        }),
      });
      console.log(response);

      if (!response.ok) {
        setSnackbarMessage(
          "You have to buy the product before leaving a feedback."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const updatedProduct = await response.json();
      onFeedbackUpdate((prev) => [...prev, updatedProduct]);
      // setProduct(updatedProduct);
      setOpenReview(false);
      setFeedbackText("");
      setFeedbackRating(0);
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };
  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Stats Section */}
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
              placeholder="Enter your feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              width="800px"
              height="35px"
            />
          </div>
          <div className="review-rating-container">
            <Rating
              name="review-stars"
              value={feedbackRating}
              onChange={(e, newValue) => setFeedbackRating(newValue)}
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
              onClick={handleFeedbackSubmit}
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
          </div>
        </div>
      )}

      {stats && (
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 500,
              mb: 1,
            }}
          >
            Average Rating: {stats.averageRating} / 5
          </Typography>
          <Typography
            sx={{
              fontFamily: "Montserrat",
              color: "white",
              mb: 2,
            }}
          >
            Total Reviews: {stats.totalFeedbacks}
          </Typography>
        </Box>
      )}

      {/* Star Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "Montserrat",
            mb: 1,
          }}
        >
          Filter by rating:
        </Typography>
        <ToggleButtonGroup
          value={starFilter}
          exclusive
          //   sx={{ marginLeft: 5 }}
          onChange={handleStarFilter}
          aria-label="star filter"
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <ToggleButton
              key={star}
              value={star}
              sx={{
                fontFamily: "Montserrat",
                border: "1px solid grey",
                color: "white",
                "&:hover": {
                  backgroundColor: "#ffcc00",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ffd700",
                  border: "1px solid grey",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "#ffc800",
                  },
                },
              }}
            >
              {star} <StarIcon sx={{ ml: 0.5 }} />
            </ToggleButton>
          ))}
          <ToggleButton
            value={null}
            sx={{
              fontFamily: "Montserrat",
              color: "white",
              border: "1px solid grey",
            }}
          >
            <div className="" style={{ color: "white" }}>
              All
            </div>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Feedbacks Display */}
      {displayedFeedbacks?.length > 0 ? (
        displayedFeedbacks.map((feedback, index) => (
          <Box key={feedback._id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                justifyContent: "flex-start",
                padding: "16px 0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Typography
                  sx={{
                    fontFamily: "Montserrat",
                    fontWeight: 500,
                    color: "grey",
                  }}
                >
                  {feedback.customerEmail}
                </Typography>
                <Rating value={feedback.feedbackStar} readOnly size="small" />
              </Box>

              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  lineHeight: 1.6,
                  color: "white",
                }}
              >
                {feedback.feedbackContent}
              </Typography>
            </Box>
            {index < displayedFeedbacks?.length - 1 && (
              <Divider sx={{ margin: "8px 0" }} />
            )}
          </Box>
        ))
      ) : (
        <Typography
          sx={{
            fontFamily: "Montserrat",
            textAlign: "center",
            color: "white",
            my: 4,
          }}
        >
          No feedback found for the selected filter.
        </Typography>
      )}

      {/* Show More/Less Button */}
      {filteredFeedbacks?.length > 3 && (
        <Button
          onClick={() => setExpanded(!expanded)}
          startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            fontFamily: "Montserrat",
            marginTop: "20px",
            color: "#4CAF4F",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
        >
          {expanded ? "Show Less" : "See More Feedback"}
        </Button>
      )}
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
    </Box>
  );
};

export default FeedbackSection;
