import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  styled
} from '@mui/material';

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
    }
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "white",
  }
}));

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

const ScrollableBox = styled(Box)({
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  scrollbarWidth: "none",
});

const ModalUpdateVoucher = ({ isOpen, onClose, voucher, onUpdateVoucher }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    discount: '',
    startDate: '',
    endDate: '',
    conditions: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (voucher) {
      setFormData({
        name: voucher.name || '',
        code: voucher.code || '',
        discount: voucher.discount || '',
        startDate: formatDateForInput(voucher.startDate) || '',
        endDate: formatDateForInput(voucher.endDate) || '',
        conditions: voucher.conditions || ''
      });
      setErrors({});
    }
  }, [voucher]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const validateForm = (data) => {
    const newErrors = {};
    const currentDate = new Date();
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (!data.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!data.code?.trim()) {
      newErrors.code = 'Code is required';
    }

    if (!data.discount?.trim()) {
      newErrors.discount = 'Discount is required';
    } else if (isNaN(data.discount) || Number(data.discount) <= 0) {
      newErrors.discount = 'Discount must be a positive number';
    }

    if (!data.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (startDate < currentDate) {
      newErrors.startDate = 'Start date must be after current date';
    }

    if (!data.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (endDate <= startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!data.conditions?.trim()) {
      newErrors.conditions = 'Conditions are required';
    }

    return newErrors;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbar({
        open: true,
        message: 'Please correct the errors in the form',
        severity: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdateVoucher(voucher._id, formData);
      setSnackbar({
        open: true,
        message: 'Voucher updated successfully!',
        severity: 'success'
      });
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update voucher',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!voucher) return null;

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
        }}
      >
        <ScrollableBox
          sx={{
            backgroundColor: '#1E1E1E',
            borderRadius: 2,
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Box sx={{ p: 5 }}>
            <Typography variant="h5" sx={{ mb: 4, color: 'white', fontWeight: 600 }}>
              Update Voucher
            </Typography>

            <Box sx={{ display: 'grid', gap: 3 }}>
              <StyledTextField
                label="Voucher Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
              />

              <StyledTextField
                label="Voucher Code"
                value={formData.code}
                onChange={handleChange('code')}
                error={!!errors.code}
                helperText={errors.code}
                fullWidth
              />

              <StyledTextField
                label="Discount"
                value={formData.discount}
                onChange={handleChange('discount')}
                error={!!errors.discount}
                helperText={errors.discount}
                fullWidth
              />

              <StyledTextField
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                error={!!errors.startDate}
                helperText={errors.startDate}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <StyledTextField
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                error={!!errors.endDate}
                helperText={errors.endDate}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <StyledTextField
                label="Conditions"
                value={formData.conditions}
                onChange={handleChange('conditions')}
                error={!!errors.conditions}
                helperText={errors.conditions}
                fullWidth
                multiline
                rows={3}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
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
                {isSubmitting ? 'Updating...' : 'Update Voucher'}
              </StyledButton>
            </Box>
          </Box>
        </ScrollableBox>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalUpdateVoucher;