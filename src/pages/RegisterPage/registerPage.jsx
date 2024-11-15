import React, { useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import InputForm from "../../components/inputForm/inputForm";
import BtnComponent from "../../components/btnComponent/btnComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [registerStatus, setRegisterStatus] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const dispatch = useDispatch();
  const validateForm = () => {
    let tempErrors = {
      username: "",
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
    if (!username) {
      tempErrors.username = "Username is required";
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

  const handleRegisterClick = async (e) => {
    try {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }
      const newUser = { username: username, email: email, password: password };
      const response = await fetch(
        `http://localhost:${process.env.PORT}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );
      const data = await response.json();
      console.log(JSON.stringify(data));
      if (data.error) {
        setRegisterStatus(data.error.message);
      } else {
        setRegisterStatus(data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setRegisterStatus("An error occurred while registering.");
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
          boxShadow: "0 4px 20px rgba(21, 26, 39, 0.9)",
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
              Welcome first to our page!
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
              Already have an account?{" "}
              <span
                className="signup-link"
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
              >
                Sign in
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
            Register
          </Typography>
          <form
            onSubmit={handleRegisterClick}
            style={{
              display: "flex",
              flexDirection: "column",
              //   gap: "5px",
              width: "100%",
              maxWidth: "300px",
              marginBottom: "60px",
            }}
          >
            <Box sx={{ marginTop: "5%", marginBottom: "20px" }}>
              <Typography
                sx={{
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "clamp(14px, 2vw, 16px)",
                  marginLeft: "4%",
                  marginBottom: "10px",
                }}
              >
                Username
              </Typography>
              <InputForm
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) {
                    setErrors({ ...errors, username: "" });
                  }
                }}
                width="100%"
                height="35px"
              />
            </Box>
            {errors.username && (
              <Typography
                sx={{
                  color: "#cc0000",
                  fontSize: "12px",
                  marginTop: "4px",
                  marginLeft: "4%",
                }}
              >
                {errors.username}
              </Typography>
            )}

            <Box sx={{ marginTop: "15px", marginBottom: "20px" }}>
              <Typography
                sx={{
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "clamp(14px, 2vw, 16px)",
                  marginLeft: "4%",
                  marginBottom: "10px",
                }}
              >
                Email
              </Typography>
              <InputForm
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                width="100%"
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

            <Box sx={{ marginTop: "", marginBottom: "20px" }}>
              <Typography
                sx={{
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "clamp(14px, 2vw, 16px)",
                  marginLeft: "4%",
                  marginBottom: "10px",
                }}
              >
                Password
              </Typography>
              <InputForm
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                width="100%"
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
                handleClick={handleRegisterClick}
                value={"Register"}
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
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
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
}

export default RegisterPage;
