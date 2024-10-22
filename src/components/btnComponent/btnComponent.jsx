import React from "react";
import { Box } from "@mui/material";

const BtnComponent = ({ handleClick, value, width, height,icon }) => {
  return (
    <Box>
      <button
        className="Login"
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "var(--button-color)",
          fontFamily: "Montserrat",
          width: `${width}px`,
          height: `${height}px`,
          color: "white",
          cursor: "pointer",
          transition:
            "background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
        }}
        onClick={handleClick}
      >
        {value}
      </button>
      <icon/>
    </Box>
  );
};

export default BtnComponent;
