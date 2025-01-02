import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, useMediaQuery } from "@mui/material";
import InputForm from "../../components/inputForm/inputForm";
import BtnComponent from "../../components/btnComponent/btnComponent";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  //   console.log(token);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError(validatePassword(value));
  };

  const handleReset = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3005/auth/reset-password",
        { token, newPassword: password }
      );
      if (response.status === 200) {
        setMessage("Password updated successfully");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage("Failed to update password");
      }
    } catch (error) {
      setMessage(
        error.response?.data || "An error occurred. Please try again."
      );
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
          width: "100%",
          height: "100%",
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
          RESET PASSWORD
        </Typography>
        <form
          onSubmit={handleReset}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            marginBottom: "15%",
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
            New Password
          </Typography>
          <Box sx={{ marginBottom: "5%" }}>
            <InputForm
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={handlePasswordChange}
              width="300px"
              height="35px"
            />
          </Box>
          {error && (
            <Typography
              sx={{
                color: "#cc0000",
                fontSize: "12px",
                marginLeft: "4%",
              }}
            >
              {error}
            </Typography>
          )}
          {message && (
            <p
              style={{
                color: "#00cc00",
              }}
            >
              {message}
            </p>
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
              handleClick={handleReset}
              value="Update"
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;
