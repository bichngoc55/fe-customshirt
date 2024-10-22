import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import "./menuItem.css";
const MenuItem = ({ title, Icon, selected, onClick }) => {
  return (
    <Box
      className={`menu-item ${selected ? "selected" : "unselected"}`}
      onClick={onClick}
    >
      <IconButton className="menu-item-icon">{Icon}</IconButton>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: "#C8FFF6",
          marginLeft: "10px",
          fontFamily: "Montserrat",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default MenuItem;
