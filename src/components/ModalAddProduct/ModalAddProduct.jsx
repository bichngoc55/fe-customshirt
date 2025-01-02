import React from "react";
import {
  Box,
  Modal as MuiModal,
  Typography,
  TextField,
  styled,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.12)",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(140, 255, 179, 0.5)",
      borderWidth: "1px",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

const StyledSelect = styled(Select)(() => ({
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: "1px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(140, 255, 179, 0.5)",
    borderWidth: "1px",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  "& .MuiSelect-select": {
    padding: "14px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  "&.MuiMenuItem-root": {
    color: "#1E1E1E",
    margin: "4px 8px",
    borderRadius: "4px",
    "&:first-of-type": {
      marginTop: "8px",
    },
    "&:last-of-type": {
      marginBottom: "8px",
    },
    "&:hover": {
      backgroundColor: "rgba(140, 255, 179, 0.1)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(140, 255, 179, 0.2)",
      "&:hover": {
        backgroundColor: "rgba(140, 255, 179, 0.3)",
      },
    },
  },
}));

const StyledChip = styled(Chip)(() => ({
  backgroundColor: "rgba(140, 255, 179, 0.2)",
  color: "white",
  margin: "2px",
  "& .MuiChip-deleteIcon": {
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover": {
      color: "white",
    },
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  "& .MuiTypography-root": {
    color: "white",
  },
  "& .MuiCheckbox-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-checked": {
      color: "#8CFFB3",
    },
  },
}));

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

const ScrollableBox = styled(Box)({
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  scrollbarWidth: "none",
});

const ModalAddProduct = ({
  isModalOpen,
  setIsModalOpen,
  setName,
  setDescription,
  setPrice,
  setColor,
  setSize,
  setSalePercent,
  setImages,
  setQuantity,
  setIsNew,
  setIsSale,
  images,
  //   onSubmit,
  handleImageUpload,
}) => {
  const [selectedSizes, setSelectedSizes] = React.useState([]);
  const [selectedColors, setSelectedColors] = React.useState([]);
  const [isNewProduct, setIsNewProduct] = React.useState(true);
  const [isSaleProduct, setIsSaleProduct] = React.useState(false);
  const [files2, setFiles] = React.useState([]);
  // new
  const [name, setLocalName] = React.useState("");
  const [description, setLocalDescription] = React.useState("");
  const [price, setLocalPrice] = React.useState("");
  const [quantity, setLocalQuantity] = React.useState("");
  const [salePercent, setLocalSalePercent] = React.useState(0);

  const [error, setError] = React.useState("");
  const handleValidate = () => {
    if (!name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!description.trim()) {
      setError("Product description is required");
      return false;
    }
    if (!selectedColors.length) {
      setError("At least one color must be selected");
      return false;
    }
    if (!selectedSizes.length) {
      setError("At least one size must be selected");
      return false;
    }
    if (!price || price <= 0) {
      setError("Valid price is required");
      return false;
    }
    if (!quantity || quantity <= 0) {
      setError("Valid quantity is required");
      return false;
    }
    if (
      isSaleProduct &&
      (!salePercent || salePercent <= 0 || salePercent > 100)
    ) {
      setError("Valid sale percentage (1-100) is required for sale items");
      return false;
    }
    if (!files2.length) {
      setError("At least one product image is required");
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Newly selected files:", files);
    setFiles((prev) => {
      const updatedFiles = [...prev, ...files];
      console.log("Updated files2 state:", updatedFiles);
      setImages(updatedFiles);
      return updatedFiles;
    });
    // console.log("Files2: ", files2);

    // console.log("Images final :", images);
  };

  const handleSizeChange = (event) => {
    const value = event.target.value;
    setSelectedSizes(value);
    setSize(value);
  };

  // const handleSalePercentChange = (e) => {
  //   const value = parseFloat(e.target.value);
  //   setSalePercent(value);
  //   const shouldBeSale = value > 0;
  //   setIsSaleProduct(shouldBeSale);
  //   setIsSale(shouldBeSale);
  // };
  const handleColorChange = (event) => {
    const value = event.target.value;
    setSelectedColors(value);
    setColor(value);
  };
  const handleOnSubmit = async () => {
    if (!handleValidate()) {
      return;
    }
    // console.log(files2);
    setName(name);
    setDescription(description);
    setPrice(price);
    setQuantity(quantity);
    setSalePercent(salePercent);
    await handleImageUpload(files2);
    setIsModalOpen(false);
  };
  const handleNewChange = (event) => {
    setIsNewProduct(event.target.checked);
    setIsNew(event.target.checked);
  };
  const handleNameChange = (e) => {
    setLocalName(e.target.value);
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setLocalDescription(e.target.value);
    setDescription(e.target.value);
  };

  const handlePriceChange = (e) => {
    setLocalPrice(e.target.value);
    setPrice(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setLocalQuantity(e.target.value);
    setQuantity(e.target.value);
  };

  const handleSalePercentChange = (e) => {
    const value = parseFloat(e.target.value);
    setLocalSalePercent(value);
    setSalePercent(value);
    const shouldBeSale = value > 0;
    setIsSaleProduct(shouldBeSale);
    setIsSale(shouldBeSale);
  };

  const handleSaleChange = (event) => {
    setIsSaleProduct(event.target.checked);
    setIsSale(event.target.checked);
    if (!event.target.checked) {
      setSalePercent(0);
    }
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["black", "white"];

  return (
    <>
      <MuiModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
        disableAutoFocus
        disableEnforceFocus
        keepMounted={false}
      >
        <ScrollableBox
          sx={{
            backgroundColor: "#1E1E1E",
            borderRadius: 2,
            width: "100%",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative",
          }}
        >
          <Box sx={{ p: 5 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: "white",
                fontWeight: 600,
                fontFamily: "Montserrat",
              }}
            >
              Add New Product
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1, color: "white", fontFamily: "Montserrat" }}
              >
                Name
              </Typography>
              <StyledTextField
                fullWidth
                onChange={handleNameChange}
                value={name}
                variant="outlined"
                placeholder="Enter the name of T-shirt..."
                // onChange={(e) => setName(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1, color: "white", fontFamily: "Montserrat" }}
              >
                Description
              </Typography>
              <StyledTextField
                fullWidth
                multiline
                rows={4}
                onChange={handleDescriptionChange}
                value={description}
                variant="outlined"
                placeholder="Enter product description..."
                // onChange={(e) => setDescription(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1, color: "white", fontFamily: "Montserrat" }}
              >
                Colors
              </Typography>
              <StyledSelect
                fullWidth
                multiple
                value={selectedColors}
                onChange={handleColorChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <StyledChip
                        key={value}
                        label={value}
                        onDelete={() => {
                          const newSelected = selectedColors.filter(
                            (color) => color !== value
                          );
                          setSelectedColors(newSelected);
                          setColor(newSelected);
                        }}
                        deleteIcon={<CancelIcon />}
                      />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "white",
                      marginTop: "8px",
                      "& .MuiList-root": {
                        padding: "0",
                      },
                    },
                  },
                }}
              >
                {colors.map((color) => (
                  <StyledMenuItem key={color} value={color}>
                    {color}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1, color: "white", fontFamily: "Montserrat" }}
              >
                Sizes
              </Typography>
              <StyledSelect
                fullWidth
                multiple
                value={selectedSizes}
                onChange={handleSizeChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <StyledChip
                        key={value}
                        label={value}
                        onDelete={() => {
                          const newSelected = selectedSizes.filter(
                            (size) => size !== value
                          );
                          setSelectedSizes(newSelected);
                          setSize(newSelected);
                        }}
                        deleteIcon={<CancelIcon />}
                      />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "white",
                      marginTop: "8px",
                      "& .MuiList-root": {
                        padding: "0",
                      },
                    },
                  },
                }}
              >
                {sizes.map((size) => (
                  <StyledMenuItem key={size} value={size}>
                    {size}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1, color: "white", fontFamily: "Montserrat" }}
              >
                Price
              </Typography>
              <StyledTextField
                fullWidth
                variant="outlined"
                type="number"
                onChange={handlePriceChange}
                value={price}
                placeholder="Enter product price..."
                // onChange={(e) => setPrice(e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1, color: "white", fontFamily: "Montserrat" }}
              >
                Sale Percent
              </Typography>
              <StyledTextField
                fullWidth
                variant="outlined"
                type="number"
                onChange={handleSalePercentChange}
                value={salePercent}
                placeholder="Enter sale percent..."
                // onChange={handleSalePercentChange}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1, color: "white", fontFamily: "Montserrat" }}
              >
                Quantity
              </Typography>
              <StyledTextField
                fullWidth
                onChange={handleQuantityChange}
                value={quantity}
                variant="outlined"
                type="number"
                placeholder="Enter product quantity..."
                // onChange={(e) => {
                //   setQuantity(e.target.value);
                // }}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 2, color: "white", fontFamily: "Montserrat" }}
              >
                Product Status
              </Typography>
              <Box sx={{ display: "flex", gap: 4 }}>
                <StyledFormControlLabel
                  control={
                    <Checkbox
                      checked={isNewProduct}
                      onChange={handleNewChange}
                    />
                  }
                  label="New Arrival"
                />
                <StyledFormControlLabel
                  control={
                    <Checkbox
                      checked={isSaleProduct}
                      onChange={handleSaleChange}
                    />
                  }
                  label="On Sale"
                />
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1, color: "white", fontFamily: "Montserrat" }}
              >
                Product Image
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    color: "white",
                    fontFamily: "Montserrat",
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    borderWidth: "1px",
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  Choose Image
                  <VisuallyHiddenInput
                    multiple
                    type="file"
                    onChange={handleImageChange}
                  />
                </Button>

                {images &&
                  files2.map((file, index) => (
                    <Box
                      key={index}
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
                  ))}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
                position: "sticky",
                bottom: 0,
                backgroundColor: "#1E1E1E",
                pt: 2,
                borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderWidth: "1px",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleOnSubmit}
                sx={{
                  bgcolor: "#37C15E",
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#7ae3a1",
                  },
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>
        </ScrollableBox>
      </MuiModal>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalAddProduct;
