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
  const dispatch = useDispatch();

  const handleRegisterClick = async (e) => {
    try {
      e.preventDefault();
      const newUser = { username: username, email: email, password: password };
      const response = await fetch("http://localhost:3005/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
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
        src={require("../../assets/images/image.png")}
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
            SIGN UP
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
            <Typography
              sx={{
                color: "white",
                fontFamily: "Montserrat",
                fontSize: "clamp(14px, 2vw, 16px)",
                marginLeft: "4%",
              }}
            >
              Username
            </Typography>
            <Box sx={{ marginBottom: "15%", marginTop: "5%" }}>
              <InputForm
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                width="100%"
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
              Email
            </Typography>
            <Box sx={{ marginBottom: "15%", marginTop: "5%" }}>
              <InputForm
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                width="100%"
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
            <Box sx={{ marginBottom: "15%", marginTop: "5%" }}>
              <InputForm
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                width="100%"
                height="35px"
              />
            </Box>
            {registerStatus && (
              <Typography
                sx={{
                  color: registerStatus.success ? "green" : "red",
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                }}
              >
                {registerStatus.message}
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
                value={"Sign up"}
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
