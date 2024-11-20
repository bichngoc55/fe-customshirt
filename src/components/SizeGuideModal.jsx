import React from "react";

const SizeGuideModal = ({ image, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <img
          src={image}
          alt="Size Guide"
          style={{ maxWidth: "100%", maxHeight: "100vh" }}
        />
        {/* <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Close
        </button> */}
      </div>
    </div>
  );
};

export default SizeGuideModal;
