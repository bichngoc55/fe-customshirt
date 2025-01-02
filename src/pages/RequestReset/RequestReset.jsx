import React, { useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import InputForm from "../../components/inputForm/inputForm";
import BtnComponent from "../../components/btnComponent/btnComponent";
import axios from "axios";
// import "./requestReset.css";

const RequestReset = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ email: "" });

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value))
        return "Please enter a valid email address";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({ email: validateField("email", value) });
  };

  const handleRequestReset = async () => {
    const emailError = validateField("email", email);

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3005/auth/request-reset",
        { email }
      );
      if (response.status === 200) {
        setMessage("Check your inbox for password reset instructions");
      } else {
        setMessage("Failed to send password reset email");
      }
    } catch (error) {
      setMessage(error.response?.data || "Error");
    }
  };

  return (
    <Box
      className="container"
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={require("../../assets/images/backgroundImg.png")}
        alt="Decorative"
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
          width: "85%",
          height: "80%",
          objectFit: "cover",
          zIndex: -1,
          borderRadius: "100px",
        }}
      />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          padding: isMobile ? "20px" : "40px",
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontFamily: "Montserrat",
            fontSize: "clamp(24px, 4vw, 30px)",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Request Password Reset
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRequestReset();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "300px",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontFamily: "Montserrat",
              fontSize: "clamp(14px, 2vw, 16px)",
              marginLeft: "4%",
            }}
          >
            Email
          </Typography>
          <Box sx={{ marginBottom: "5%" }}>
            <InputForm
              placeholder="Enter your email here..."
              value={email}
              onChange={handleEmailChange}
              width="300px"
              height="35px"
            />
          </Box>
          {errors.email && (
            <Typography
              sx={{
                color: "#cc0000",
                fontSize: "12px",
                marginLeft: "4%",
              }}
            >
              {errors.email}
            </Typography>
          )}
          {message && (
            <Typography
              sx={{
                color: message.includes("Check") ? "green" : "#cc0000",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {message}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <BtnComponent
              width="130"
              height={40}
              handleClick={handleRequestReset}
              value="Send email"
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default RequestReset;
