import React from "react";
import { Box, Button, Typography } from "@mui/material";

const Confirm = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        // bgcolor="primary.main"
        borderRadius={2}
        p={4}
      >
        <img
          src={require("./image.png")}
          style={{ width: "40px", height: "40px", marginBottom: "20px" }}
        />
        <Typography
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: "#C8FFF6",
            fontSize: "28px",
          }}
        >
          Your Order is completed!
        </Typography>
        <Box
          display="flex"
          marginTop="20px"
          flexDirection="row"
          alignItems="center"
          gap={2}
        >
          <Button
            sx={{
              color: "#F7D87A",
              border: "0.4px solid #2EBB77",
              borderRadius: "15px",
              padding: "10px",
            }}
            href="/"
          >
            Go to the Home Page
          </Button>
          <Button
            sx={{
              color: "#F7D87A",
              border: "0.4px solid #2EBB77",
              borderRadius: "15px",
              padding: "10px",
            }}
          >
            View my order
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Confirm;
