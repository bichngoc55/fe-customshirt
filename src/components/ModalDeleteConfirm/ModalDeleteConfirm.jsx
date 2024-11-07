import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

const ModalDeleteConfirm = ({
  isOpenModal,
  setOpenModal,
  handleDeleteProduct,
  handleCloseDeleteModal,
}) => {
  return (
    <Modal
      open={isOpenModal}
      onClose={() => setOpenModal(false)}
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
          marginLeft: "100px",
          marginRight: "100px",
          width: "50%",
          alignItems: "flex-end",
          maxWidth: "600px",
          color: "white",
        }}
      >
        <div
          style={{
            fontFamily: "Montserrat",
            fontSize: "1.2rem",
            marginBottom: "20px",
          }}
        >
          Are you sure you want to{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>delete</span> this
          product?
        </div>
        <Button
          variant="outlined"
          onClick={handleCloseDeleteModal}
          sx={{
            // bgcolor: "none",
            color: "white",
            marginRight: "5%",
            marginLeft: "50%",
            borderColor: "rgba(255, 255, 255, 0.12)",
            borderWidth: "1px",
            "&:hover": {
              bgcolor: "#7deea2",
            },
            "&:disabled": {
              bgcolor: "rgba(140, 255, 179, 0.5)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClose={handleDeleteProduct}
          sx={{
            bgcolor: "red",
            color: "white",
            "&:hover": {
              bgcolor: "#7deea2",
            },
            "&:disabled": {
              bgcolor: "rgba(140, 255, 179, 0.5)",
            },
          }}
        >
          Delete
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalDeleteConfirm;
