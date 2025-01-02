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
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(null);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value))
        return "Please enter a valid email address";
    }
    if (name === "password") {
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: validateField("email", value),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: validateField("password", value),
    }));
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    setErrors({
      email: emailError,
      password: passwordError,
      general: "",
    });

    if (emailError || passwordError) {
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password }));
      if (result.error) {
        setErrors((prev) => ({
          ...prev,
          general: result.error.message || "Login failed. Please try again.",
        }));
        setLoginStatus(result.error.message);
      } else {
        setLoginStatus(result.message);
        navigate("/");
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred. Please try again later.",
      }));
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
                  // marginTop: "4px",
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
                type="password"
                placeholder="Enter your password here..."
                value={password}
                onChange={handlePasswordChange}
                width="300px"
                height="35px"
              />
            </Box>
            {errors.password && (
              <Typography
                sx={{
                  color: "#cc0000",
                  fontSize: "12px",
                  // marginTop: "4px",
                  marginLeft: "4%",
                }}
              >
                {errors.password}
              </Typography>
            )}
            {errors.general === "Rejected" && (
              <Typography
                sx={{
                  color: "#cc0000",
                  fontSize: "12px",
                  marginTop: "4px",
                  marginLeft: "4%",
                  // textAlign: "center",
                }}
              >
                {"Invalid password or email address. Please try again."}
              </Typography>
            )}
            <Typography
              onClick={() => navigate("/forget-password")}
              sx={{
                color: "white",
                fontSize: "12px",
                marginTop: "4px",
                marginLeft: "4%",
              }}
            >
              {"Forget password"}
            </Typography>
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
                value="Login"
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
