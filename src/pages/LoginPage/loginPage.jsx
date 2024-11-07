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

  const handleLoginClick = async (e) => {
    e.preventDefault();
    const newUser = { email: email, password: password };
    try {
      const result = await dispatch(loginUser(newUser));
      console.log("result trong login : ", result);
      if (result.error) {
        console.log(result.error.message);
        setLoginStatus(result.error.message);
      } else {
        console.log(result.message);
        setLoginStatus(result.message);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const forgotPassword = async (e) => {
    e.preventDefault();
    console.log(email);
    fetch("http://localhost:3000/auth/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        alert(data.status);
      })
      .catch((error) => {
        console.error(error);
      });
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
                onChange={(e) => setEmail(e.target.value)}
                width="300px"
                height="35px"
              />
            </Box>
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
                onChange={(e) => setPassword(e.target.value)}
                width="300px"
                height="35px"
              />
            </Box>
            {loginStatus && (
              <Typography
                sx={{
                  color: loginStatus.success ? "green" : "red",
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                }}
              >
                {loginStatus.message}
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
