import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import "./loginPage.css";
import InputForm from "../../components/inputForm/inputForm";
import BtnComponent from "../../components/btnComponent/btnComponent";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isEmailFocused, setEmailFocus] = useState(false);
  const [isPasswordFocused, setPasswordFocus] = useState(false);
  const [password, setPassword] = useState("");
  const handleLoginClick = () => {
    console.log("heheh");
  };
  return (
    <div className="container" style={{}}>
      <img
        src={require("../../assets/images/image.png")}
        alt="Decorative"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          marginTop: "5%",
          height: "100%",
          width: "100%",
          objectFit: "contain",
          zIndex: -1,
        }}
      />
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
        sx={{
          height: "100%",
          width: "100%",
        }}
        position="relative"
      >
        <Box className="right">
          <Typography
            style={{
              color: "white",
              fontFamily: "Montserrat",
              fontSize: "38px",
              fontWeight: "lighter",
            }}
          >
            Welcome back to our page{" "}
          </Typography>
          <Typography
            style={{
              color: "white",
              fontFamily: "Montserrat",
            }}
          >
            Do not have an account?{" "}
            <span className="signup-link" onClick={() => navigate("/register")}>
              {" "}
              Sign up{" "}
            </span>
            now
          </Typography>
        </Box>
        <Box
          className="left"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          padding="90px"
          zIndex={1}
          position="relative"
        >
          <Typography
            style={{
              color: "white",
              fontFamily: "Montserrat",
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            SIGN IN
          </Typography>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "300px",
              marginTop: "10%",
            }}
          >
            <Typography
              style={{
                marginLeft: "5%",
                color: "white",
                fontFamily: "Montserrat",
              }}
            >
              Username/Email
            </Typography>

            <InputForm
              placeholder="Email"
              width="300px"
              height="50px"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <Typography
              style={{
                marginLeft: "5%",
                color: "white",
                fontFamily: "Montserrat",
              }}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            >
              Password
            </Typography>

            <InputForm
              placeholder="Password"
              type="password"
              width="300px"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              height="50px"
            />
            <Box sx={{ marginLeft: "17%" }}>
              <BtnComponent
                width={200}
                height={40}
                handleClick={handleLoginClick}
                value={"Login"}
              />
            </Box>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;
