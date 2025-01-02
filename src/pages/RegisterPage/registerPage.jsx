import React, { useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import InputForm from "../../components/inputForm/inputForm";
import BtnComponent from "../../components/btnComponent/btnComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/authSlice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [registerStatus, setRegisterStatus] = useState(null);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    general: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        return !value ? "Username is required" : "";
      case "email":
        return !value
          ? "Email is required"
          : !/\S+@\S+\.\S+/.test(value)
          ? "Please enter a valid email address"
          : "";
      case "password":
        return !value
          ? "Password is required"
          : value.length < 6
          ? "Password must be at least 6 characters"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  // const handleRegisterClick = async (e) => {
  //   e.preventDefault();

  //   const validationErrors = {
  //     username: validateField("username", username),
  //     email: validateField("email", email),
  //     password: validateField("password", password),
  //   };

  //   setErrors(validationErrors);

  //   if (Object.values(validationErrors).some((error) => error)) {
  //     return;
  //   }

  //   } catch (error) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       general: "Registration failed. Please try again.",
  //     }));
  //   }
  // };
  const handleRegisterClick = async (e) => {
    e.preventDefault();

    const validationErrors = {
      username: validateField("username", username),
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    try {
      await dispatch(
        registerUser({
          username,
          email,
          password,
        })
      ).unwrap();

      navigate("/login");
    } catch (error) {
      // Handle specific error fields
      setErrors((prev) => ({
        ...prev,
        [error.field]: error.message,
        general: error.field === "general" ? error.message : "",
      }));
    }
  };

  const renderInput = (label, field, type = "text") => (
    <Box>
      <Box sx={{ marginBottom: "25px", marginTop: "10px" }}>
        <Typography
          sx={{
            color: "white",
            fontFamily: "Montserrat",
            fontSize: "clamp(14px, 2vw, 16px)",
            marginLeft: "4%",
            marginBottom: "10px",
          }}
        >
          {label}
        </Typography>
        <InputForm
          type={type}
          placeholder={label}
          value={
            field === "username"
              ? username
              : field === "email"
              ? email
              : password
          }
          onChange={handleChange(field)}
          width="100%"
          height="35px"
        />
      </Box>
      {errors[field] && (
        <Typography
          sx={{
            color: "#cc0000",
            fontSize: "12px",
            // marginTop: "4px",
            marginLeft: "4%",
          }}
        >
          {errors[field]}
        </Typography>
      )}
    </Box>
  );

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
              width: "100%",
              maxWidth: "300px",
              marginBottom: "60px",
            }}
          >
            {renderInput("Username", "username")}
            {renderInput("Email", "email")}
            {renderInput("Password", "password", "password")}

            {errors.general === "Rejected" && (
              <Typography
                sx={{
                  color: "#cc0000",
                  fontSize: "12px",
                  marginTop: "4px",
                  marginLeft: "4%",
                  textAlign: "center",
                }}
              >
                {"Please try again."}
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
                value="Register"
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
