import React, { useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const SearchResultModal = ({
  isOpenModal,
  isLoading,
  handleImageSearchUpload,
  searchError,
  setIsOpenModalSearchImage,
}) => {
  const fileInputRef = useRef(null);

  const handleClose = () => {
    setIsOpenModalSearchImage(false);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageSearchUpload(file);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Modal
      open={isOpenModal}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1E1E1E",
          padding: 4,
          borderRadius: 2,
          width: "90%",
          maxWidth: "600px",
          color: "white",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            position: "relative",
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileInputChange}
          />
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadButtonClick}
            disabled={isLoading}
            sx={{
              backgroundColor: "#8CFFB3",
              color: "black",
              "&:hover": {
                backgroundColor: "#70E69C",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(140, 255, 179, 0.5)",
                color: "rgba(0,0,0,0.5)",
              },
            }}
          >
            Upload Image
          </Button>

          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                color: "#8CFFB3",
                position: "absolute",
                top: "50%",
                left: "calc(50% + 100px)",
                marginTop: "-12px",
                marginLeft: "12px",
              }}
            />
          )}
        </Box>

        {searchError && (
          <Typography
            sx={{
              mt: 2,
              color: "red",
              textAlign: "center",
            }}
          >
            {searchError}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isLoading}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "#8CFFB3",
                color: "#8CFFB3",
              },
              "&.Mui-disabled": {
                color: "rgba(255,255,255,0.5)",
                borderColor: "rgba(255,255,255,0.5)",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SearchResultModal;
