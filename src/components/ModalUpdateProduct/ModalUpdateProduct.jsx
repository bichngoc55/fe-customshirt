import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  styled,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";
import axios from "axios";
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

const ModalUpdateProduct = ({
  isModalOpen,
  setIsModalOpen,
  setUpdateProduct,
  product,
  handleUpdateProduct,
}) => {
  const [selectedSizes, setSelectedSizes] = useState(product.size);
  const [selectedColors, setSelectedColors] = useState(product.color);
  const [isNewProduct, setIsNewProduct] = useState(product.isNewShirt);
  const [isSaleProduct, setIsSaleProduct] = useState(product.isSale);
  const [existingImages, setExistingImages] = useState(product.imageUrl || []);
  const [newFiles, setNewFiles] = useState([]);

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [salePercent, setSalePercent] = useState(product.salePercent);

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setFiles((prev) => {
  //     const updatedFiles = [...prev, ...files];
  //     return updatedFiles;
  //   });
  // };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
  };

  const handleDeleteImage = (index, isExisting) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const handleSizeChange = (event) => {
    const value = event.target.value;
    setSelectedSizes(value);
  };

  const handleColorChange = (event) => {
    const value = event.target.value;
    setSelectedColors(value);
  };

  const handleNewChange = (event) => {
    setIsNewProduct(event.target.checked);
  };

  const handleSaleChange = (event) => {
    setIsSaleProduct(event.target.checked);
  };

  const handleOnSubmit = async () => {
    try {
      const newImageUrls = await Promise.all(
        newFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "domdom");
          formData.append("cloud_name", "dejoc5koc");

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dejoc5koc/image/upload`,
            formData
          );

          return response.data.secure_url;
        })
      );
      console.log("new Image ", newImageUrls);

      console.log("isSaleProduct", isSaleProduct);
      console.log("isNewShirt", isNewProduct);

      await handleUpdateProduct({
        name,
        description,
        size: selectedSizes,
        color: selectedColors,
        price: price,
        quantity: quantity,
        salePercent: salePercent,
        isNewShirt: isNewProduct,
        isSale: isSaleProduct,
        imageUrl: [...existingImages, ...newImageUrls],
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["black", "white"];

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
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
            Update Product
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
              value={name}
              variant="outlined"
              // placeholder="Enter the name of T-shirt..."
              onChange={(e) => setName(e.target.value)}
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
              value={description}
              multiline
              rows={4}
              variant="outlined"
              // placeholder="Enter product description..."
              onChange={(e) => setDescription(e.target.value)}
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
              value={price}
              type="number"
              // placeholder="Enter product price..."
              onChange={(e) => setPrice(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "white", fontFamily: "Montserrat" }}
            >
              Sale percent
            </Typography>
            <StyledTextField
              fullWidth
              variant="outlined"
              value={salePercent}
              type="number"
              // placeholder="Enter product price..."
              onChange={(e) => setSalePercent(e.target.value)}
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
              variant="outlined"
              value={quantity}
              type="number"
              // placeholder="Enter product quantity..."
              onChange={(e) => setQuantity(e.target.value)}
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
                  <Checkbox checked={isNewProduct} onChange={handleNewChange} />
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

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {existingImages.map((imageUrl, index) => (
                  <Box
                    key={`existing-${index}`}
                    sx={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        borderRadius: 1,
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundImage: `url(${imageUrl})`,
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
                  </Box>
                ))}

                {/* New Files */}
                {newFiles.map((file, index) => (
                  <Box
                    key={`new-${index}`}
                    sx={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        borderRadius: 1,
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundImage: `url(${URL.createObjectURL(file)})`,
                      }}
                    />
                    <Button
                      onClick={() => handleDeleteImage(index, false)}
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
                  </Box>
                ))}
              </Box>
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
              Update Product
            </Button>
          </Box>
        </Box>
      </ScrollableBox>
    </Modal>
  );
};

export default ModalUpdateProduct;
