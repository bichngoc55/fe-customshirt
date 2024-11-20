import { Modal } from "@mui/material";
import React from "react";

const NotifyMessage = ({ isOpen, message, status }) => {
  return (
    <Modal
      open={isOpen}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {status === "success" ? (
        <>
          <div style={{ fontFamily: "Montserrat", color: "green" }}>
            {message}
          </div>
        </>
      ) : (
        <>
          <div style={{ fontFamily: "Montserrat", color: "red" }}>
            {message}
          </div>
        </>
      )}
    </Modal>
  );
};

export default NotifyMessage;
