import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

const CancelOrderDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "var(--background-color)",
          border: "1px solid #FA8B01",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
        },
      }}
    >
      <DialogTitle
        style={{
          color: "white",
          fontFamily: "Montserrat",
          fontSize: "20px",
          fontWeight: "bold",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(250, 139, 1, 0.2)",
        }}
      >
        Cancel Order
      </DialogTitle>
      <DialogContent style={{ padding: "24px" }}>
        <DialogContentText
          style={{
            color: "#C8FFF6",
            fontFamily: "Montserrat",
            fontSize: "16px",
            marginBottom: "8px",
          }}
        >
          Are you sure you want to cancel this order? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        style={{
          padding: "16px 24px",
          borderTop: "1px solid rgba(250, 139, 1, 0.2)",
          gap: "12px",
        }}
      >
        <Button
          onClick={onClose}
          style={{
            fontFamily: "Montserrat",
            backgroundColor: "transparent",
            border: "1px solid #333",
            color: "white",
            padding: "8px 16px",
            textTransform: "none",
            minWidth: "120px",
          }}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid #333",
            },
          }}
        >
          No, keep order
        </Button>
        <Button
          onClick={onConfirm}
          style={{
            fontFamily: "Montserrat",
            backgroundColor: "#FA8B01",
            color: "white",
            padding: "8px 16px",
            textTransform: "none",
            minWidth: "120px",
          }}
          sx={{
            "&:hover": {
              backgroundColor: "#d67601",
            },
          }}
        >
          Yes, cancel order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelOrderDialog;
