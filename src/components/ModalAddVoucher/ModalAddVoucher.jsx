import React, { useState } from "react";
import {
  Box,
  Modal as MuiModal,
  Typography,
  TextField,
  Button,
  styled,
  Snackbar,
  Alert
} from "@mui/material";

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.7)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(140, 255, 179, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(140, 255, 179, 0.5)",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
    padding: "10px",
    fontFamily: "Montserrat",
  },
  "& .MuiInputLabel-root": {
    color: "white",
    fontFamily: "Montserrat",
    transform: "translate(14px, 14px) scale(1)",  // Ensures the label stays in place
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -6px) scale(0.75)",  // Adjust label position on focus
  },
}));

const StyledButton = styled(Button)(({ variant }) => ({
  padding: "7px 20px",
  borderRadius: "8px",
  fontWeight: 500,
  ...(variant === "outlined"
    ? {
        color: "white",
        borderColor: "rgba(255, 255, 255, 0.7)",
        "&:hover": {
          borderColor: "white",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }
    : {
        backgroundColor: "#37C15E",
        color: "white",
        "&:hover": {
          backgroundColor: "#2ea350",
        },
      }),
}));

const ModalAddVoucher = ({ isOpen, onClose, onAddVoucher }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discount: "",
    startDate: "",
    endDate: "",
    conditions: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateData = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.code) newErrors.code = "Code is required";
    if (!formData.discount || isNaN(Number(formData.discount)))
      newErrors.discount = "Valid discount is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (formData.startDate && new Date(formData.startDate) < new Date())
      newErrors.startDate = "Start date must be later than the current date";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    )
      newErrors.endDate = "End date must be later than start date";
    if (!formData.conditions) newErrors.conditions = "Conditions are required";

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateData();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbarState({
        open: true,
        message: "Please fix the errors in the form",
        severity: "error",
      });
      return;
    }
  
    try {
      await onAddVoucher(formData);  
     
      onClose();
    } catch (error) {
      // Xử lý lỗi từ `onAddVoucher`
    //   setSnackbarState({
    //     open: true,
    //     message: error.message || "Failed to add voucher",
    //     severity: "error",
    //   });
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <>
      <MuiModal open={isOpen} onClose={onClose}>
        <Box
          sx={{
            backgroundColor: "#1E1E1E",
            borderRadius: 2,
            width: "100%",
            maxWidth: "500px",
            p: 4,
            mx: "auto",
            mt: "10vh",
          }}
        >
          <Typography  sx={{ color: "white", mb: 3 , fontFamily:"Montserrat" , fontSize:"1.2rem" , fontWeight:"bold" }}>
            Add New Voucher
          </Typography>
          <StyledTextField
            label="Voucher Name"
            fullWidth
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <StyledTextField
            label="Voucher Code"
            fullWidth
            value={formData.code}
            onChange={handleChange("code")}
            error={!!errors.code}
            helperText={errors.code}
            sx={{ mb: 2 }}
          />
          <StyledTextField
            label="Discount Amount"
            fullWidth
            value={formData.discount}
            onChange={handleChange("discount")}
            error={!!errors.discount}
            helperText={errors.discount}
            sx={{ mb: 2 }}
          />
          <StyledTextField
            label="Start Date"
            type="date"
            fullWidth
            value={formData.startDate}
            onChange={handleChange("startDate")}
            error={!!errors.startDate}
            helperText={errors.startDate}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <StyledTextField
            label="End Date"
            type="date"
            fullWidth
            value={formData.endDate}
            onChange={handleChange("endDate")}
            error={!!errors.endDate}
            helperText={errors.endDate}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <StyledTextField
            label="Conditions"
            fullWidth
            multiline
            rows={3}
            value={formData.conditions}
            onChange={handleChange("conditions")}
            error={!!errors.conditions}
            helperText={errors.conditions}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <StyledButton variant="outlined" onClick={onClose}>
              Cancel
            </StyledButton>
            <StyledButton variant="contained" onClick={handleSubmit}>
              Add Voucher
            </StyledButton>
          </Box>
        </Box>
      </MuiModal>
      <Snackbar
  open={snackbarState.open}
  autoHideDuration={3000}
  onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))}
  anchorOrigin={{ 
    vertical: snackbarState.vertical || 'top', 
    horizontal: snackbarState.horizontal || 'center' 
  }}
  sx={{ top: 20 }}
>
  <Alert 
    onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))}
    severity={snackbarState.severity}
    sx={{ width: '100%' }}
  >
    {snackbarState.message}
  </Alert>
</Snackbar>
    </>
  );
};

export default ModalAddVoucher;
