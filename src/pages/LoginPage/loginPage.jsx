import React, { useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import "./loginPage.css";
import InputForm from "../../components/inputForm/inputForm";
import BtnComponent from "../../components/btnComponent/btnComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/authSlice.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const validateForm = () => {
    let tempErrors = {
      email: "",
      password: "",
      general: "",
    };
    let isValid = true;

    if (!email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newUser = { email: email, password: password };
    try {
      const result = await dispatch(loginUser(newUser));
      console.log("result trong login : ", result);
      if (result.error) {
        console.log(result.error.message);
        setErrors({
          ...errors,
          general: result.error.message || "Login failed. Please try again.",
        });
        setLoginStatus(result.error.message);
      } else {
        console.log(result.message);
        setLoginStatus(result.message);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setErrors({
        ...errors,
        general: "An unexpected error occurred. Please try again later.",
      });
    }
  };
  const forgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors({
        ...errors,
        email: "Please enter your email to reset password",
      });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/auth/forgotPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Password reset instructions have been sent to your email");
      } else {
        setErrors({
          ...errors,
          general: data.message || "Failed to process password reset",
        });
      }
    } catch (error) {
      setErrors({
        ...errors,
        general: "Failed to connect to the server. Please try again later.",
      });
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
        flexDirection={isMobile ? "column" : "row"}
        alignItems="center"
        justifyContent="center"
        sx={{
          width: "100%",
          height: "100%",
          padding: isMobile ? "20px" : "40px",
          boxSizing: "border-box",
        }}
      >
        {!isMobile && (
          <Box
            className="right"
            sx={{
              flex: 1,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              marginBottom: "10%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontFamily: "Montserrat",
                fontSize: "clamp(24px, 5vw, 38px)",
                fontWeight: "lighter",
                paddingLeft: "5%",
              }}
            >
              Welcome back to our page!
            </Typography>
            <Typography
              sx={{
                color: "white",
                fontFamily: "Montserrat",
                marginTop: "20px",
                textAlign: "center",
                fontSize: "clamp(14px, 2vw, 16px)",
              }}
            >
              Do not have an account?{" "}
              <span
                className="signup-link"
                onClick={() => navigate("/register")}
                style={{ cursor: "pointer" }}
              >
                Sign up
              </span>{" "}
              now
            </Typography>
          </Box>
        )}
        <Box
          className="left"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            flex: 1,
            padding: isMobile ? "20px" : "40px",
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
            LOGIN
          </Typography>
          <form
            onSubmit={handleLoginClick}
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
              Email
            </Typography>
            <Box sx={{ marginBottom: "8%" }}>
              <InputForm
                placeholder="Enter your email here..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                width="300px"
                height="35px"
              />
            </Box>
            {errors.email && (
              <Typography
                sx={{
                  color: "#cc0000",
                  fontSize: "12px",
                  marginTop: "4px",
                  marginLeft: "4%",
                }}
              >
                {errors.email}
              </Typography>
            )}
            <Typography
              sx={{
                color: "white",
                fontFamily: "Montserrat",
                fontSize: "clamp(14px, 2vw, 16px)",
                marginLeft: "4%",
              }}
            >
              Password
            </Typography>
            <Box sx={{ marginBottom: "5%" }}>
              <InputForm
                placeholder="Enter your password here..."
                value={password}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                width="300px"
                height="35px"
              />
            </Box>
            {errors.password && (
              <Typography
                sx={{
                  color: "#cc0000",
                  fontSize: "12px",
                  marginTop: "4px",
                  marginLeft: "4%",
                }}
              >
                {errors.password}
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
                width="100"
                height={40}
                handleClick={handleLoginClick}
                value={"Login"}
              />
            </Box>
          </form>
          {isMobile && (
            <Typography
              sx={{
                color: "white",
                fontFamily: "Montserrat",
                marginTop: "20px",
                textAlign: "center",
                fontSize: "clamp(14px, 2vw, 16px)",
              }}
            >
              Do not have an account?{" "}
              <span
                className="signup-link"
                onClick={() => navigate("/register")}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Sign up
              </span>{" "}
              now
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
