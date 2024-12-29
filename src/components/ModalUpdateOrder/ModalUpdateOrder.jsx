import React, { useState, useEffect } from "react";
import {
  Box,
  Modal as MuiModal,
  Typography,
  TextField,
  Button,
  Select, 
  styled,
  Snackbar, Alert, FormControl, MenuItem
} from "@mui/material"; 

import { provinces, districts } from "./vietnamLocations";


const StyledMenuItem = styled(MenuItem)({
    "&:hover": {
      backgroundColor: "rgba(140, 255, 179, 0.1)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(140, 255, 179, 0.2)",
      "&:hover": {
        backgroundColor: "rgba(140, 255, 179, 0.3)",
      },
    },
  });
const StyledTextField = styled(TextField)(() => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.7)",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(140, 255, 179, 0.5)",
        borderWidth: "2px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(140, 255, 179, 0.5)",
        borderWidth: "2px",
      },
      "&.Mui-disabled": {
        "& fieldset": {
          borderColor: "rgba(255, 255, 255, 0.5)",
        },
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
      "&.Mui-disabled": {
        color: "rgba(255, 255, 255, 0.7)",
        WebkitTextFillColor: "white",
      },
    },
    "& .MuiInputLabel-root": {
      color: "white",
      "&.Mui-disabled": {
        color: "white",
      },
    },
  }));
  
  const StyledSelect = styled(Select)(() => ({
    color: "rgba(255, 255, 255, 0.7)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(140, 255, 179, 0.5)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(140, 255, 179, 0.5)",
    },
    "& .MuiSvgIcon-root": {
      color: "rgba(140, 255, 179, 0.5)",
    },
  }));
  
  const ScrollableBox = styled(Box)({
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none",
    scrollbarWidth: "none",
  });
  
  const StyledButton = styled(Button)(({ variant }) => ({
    padding: "7px 20px",
    borderRadius: "8px",
    transition: "all 0.5s ease",
    fontWeight: 500,
    ...(variant === "outlined" ? {
      color: "white",
      borderColor: "rgba(255, 255, 255, 0.7)",
      borderWidth: "1px",
      "&:hover": {
        borderColor: "white",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: "2px",
        transform: "translateY(-2px)",
      },
    } : {
      backgroundColor: "#37C15E",
      color: "white",
      "&:hover": {
        backgroundColor: "#2ea350",
        transform: "translateY(-2px)",
        boxShadow: "0 5px 15px rgba(55, 193, 94, 0.3)",
      },
    }),
  }));
  
  const MAJOR_CITIES = ["79"]; // HCM and Hanoi
const SHIPPING_FEES = {
  major: 15000,
  other: 35000
};

const validateOrderData = (formData) => {
    const errors = {};
    
    if (!formData.province) {
      errors.province = "Province is required";
    }
    
    if (!formData.district) {
      errors.district = "District is required";
    }
    
    if (!formData.details) {
      errors.details = "Address details are required";
    } else if (formData.details.length < 10) {
      errors.details = "Please provide more detailed address information";
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  const ModalUpdateOrder = ({ isOpen, onClose, order, onUpdate,  districts }) => {
    const [formData, setFormData] = useState({
      province: order?.billingAddress.province,
      district: order?.billingAddress.district,
      details: order?.billingAddress.details,
    });
   
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbarState, setSnackbarState] = useState({
      open: false,
      message: "",
      severity: "success",
      autoHideDuration: 3000
    });

    useEffect(() => {
        console.log("HEHHEHE", order?.billingAddress.province )
        if (order?.billingAddress) {
          setFormData({
            province: order.billingAddress.province || "",
            district: order.billingAddress.district || "",
            details: order.billingAddress.details || "",
          });
          setErrors({});
        }
      }, [order]);

      useEffect(() => {
        if (formData.province && districts) {
          const filteredDistricts = districts.filter(
            district => district.idProvince === formData.province
          );
          setAvailableDistricts(filteredDistricts);
        } else {
          setAvailableDistricts([]);
        }
      }, [formData.province, districts]);
      useEffect(() => {
        if (formData.province && districts) {
          console.log("Setting districts for province:", formData.province);
          const filteredDistricts = districts.filter(
            district => district.idProvince === formData.province
          );
          console.log("Filtered districts:", filteredDistricts);
          setAvailableDistricts(filteredDistricts);
        }
      }, [formData.province, districts]);

      const calculateShippingFee = (provinceId) => {
        return MAJOR_CITIES.includes(provinceId) ? SHIPPING_FEES.major : SHIPPING_FEES.other;
      };

      const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => {
          const newData = {
            ...prev,
            [field]: value
          };
          if (field === 'province') {
            newData.district = '';
          }
          
          return newData;
        });
        if (errors[field]) {
            setErrors(prev => ({
              ...prev,
              [field]: undefined
            }));
          }
        };

        const showSnackbar = (message, severity = "success", duration = 3000) => {
            setSnackbarState({
              open: true,
              message,
              severity,
              autoHideDuration: duration
            });
          };

          const handleSubmit = async () => {
            const validation = validateOrderData(formData);
            
            if (!validation.isValid) {
              setErrors(validation.errors);
              showSnackbar("Please correct the errors in the form", "error");
              return;
            }
        
            setIsSubmitting(true);
            try {
              const shippingFee = calculateShippingFee(formData.province);
              await onUpdate(order._id, { 
                billingAddress: formData,
                shippingFee 
              });
              showSnackbar("Order updated successfully!");
              onClose();
            } catch (error) {
              const errorMessage = error?.response?.data?.message || "Failed to update order";
              showSnackbar(errorMessage, "error", 5000);
            } finally {
              setIsSubmitting(false);
            }
          };

          const handleSnackbarClose = (event, reason) => {
            if (reason === 'clickaway') return;
            setSnackbarState(prev => ({ ...prev, open: false }));
          };

  if (!order) return null;

  return (
    <>
      <MuiModal
        open={isOpen}
        onClose={onClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 1,
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
          }}
        >
          <Box sx={{ p: 5 }}>
            <Typography variant="h5" sx={{ mb: 4, color: "white", fontWeight: 600 }}>
              Order Details
            </Typography>

            {/* Read-only Information */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ color: "white", mb: 2 }}>Order Information</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <StyledTextField
                  label="Order ID"
                  value={order._id}
                  disabled
                  fullWidth
                />
                <StyledTextField
                  label="Customer Name"
                  value={order.userInfo.name}
                  disabled
                  fullWidth
                />
                <StyledTextField
                  label="Total Amount"
                  value={`${(order.total + order.shippingFee).toLocaleString('vi-VN')}đ`}
                  disabled
                  fullWidth
                />
                <StyledTextField
                  label="Shipping Fee"
                  value={`${calculateShippingFee(formData.province).toLocaleString('vi-VN')}đ`}
                  disabled
                  fullWidth
                />
              </Box>
            </Box>

            {/* Editable Billing Address */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ color: "white", mb: 2 }}>Delivery Address</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <FormControl fullWidth error={!!errors.province}>
                  <Typography variant="body1" sx={{ mb: 1, color: "#C8FFF6", fontWeight: "bold" }}>
                    Province/City
                  </Typography>
                  <StyledSelect
                    value={formData.province}
                    onChange={handleChange("province")}
                    displayEmpty
                  >
                    <StyledMenuItem value="">
                      <em>Select Province</em>
                    </StyledMenuItem>
                    {provinces.map((province) => (
                      <StyledMenuItem
                        key={province.idProvince}
                        value={province.idProvince}
                      >
                        {province.name}
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>

                <FormControl fullWidth error={!!errors.district}>
                    <Typography variant="body1" sx={{ mb: 1, color: "#C8FFF6", fontWeight: "bold" }}>
                        District
                    </Typography>
                    <StyledSelect
                        value={formData.district}
                        onChange={handleChange("district")}
                        disabled={!formData.province}
                        displayEmpty
                    >
                        <StyledMenuItem value="">
                        <em>Select District</em>
                        </StyledMenuItem>
                        {availableDistricts.map((district) => (
                        <StyledMenuItem
                            key={district.idDistrict}
                            value={district.idDistrict}
                        >
                            {district.name}
                        </StyledMenuItem>
                        ))}
                    </StyledSelect>
                    </FormControl>

                <StyledTextField
                  label="Details"
                  name="details"
                  value={formData.details}
                  onChange={(e) => handleChange("details")(e)}
                  error={!!errors.details}
                  helperText={errors.details}
                  fullWidth
                  sx={{ gridColumn: "1 / -1" }}
                  multiline
                  rows={3}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
              <StyledButton 
                onClick={onClose} 
                variant="outlined"
                disabled={isSubmitting}
              >
                Cancel
              </StyledButton>
              <StyledButton 
                onClick={handleSubmit} 
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Order"}
              </StyledButton>
            </Box>
          </Box>
        </ScrollableBox>
      </MuiModal>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={snackbarState.autoHideDuration}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarState.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalUpdateOrder; 