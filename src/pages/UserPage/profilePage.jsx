import React from "react";
import { Avatar, styled, TextField, Box, Typography } from "@mui/material";
import BtnComponent from "../../components/btnComponent/btnComponent";
import noImg from "../../assets/images/no_img.jpeg";

const StyledInputForm = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2a2d3e",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#fff",
    "&::placeholder": {
      color: "#6c7293",
      opacity: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
    marginBottom: "8px",
  },
}));
const Profile = () => {
  // Profile component logic here
  return (
    <>
      <Box
        className="Avatar"
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <Avatar src={noImg} sx={{ width: 50, height: 50 }} />
        <Box>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Montserrat",
              fontSize: "20px",
            }}
          >
            Gấu Tối
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontFamily: "Montserrat",
              color: "#808080",
            }}
          >
            alexarawles@gmail.com
          </Typography>
        </Box>
      </Box>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "400px",
          margin: "20px auto",
        }}
      >
        <StyledInputForm
          label="Full Name"
          placeholder="Your full name"
          variant="outlined"
          fullWidth
        />
        <StyledInputForm
          label="Phone number"
          placeholder="Your phone number"
          variant="outlined"
          fullWidth
        />
        <StyledInputForm
          label="Current password"
          placeholder="Your current password"
          type="password"
          variant="outlined"
          fullWidth
        />
        <StyledInputForm
          label="Current Address"
          placeholder="Your current address"
          variant="outlined"
          fullWidth
        />
        <BtnComponent
          handleClick={() => {
            /* handle logout */
          }}
          width={"100%"}
          height={"40px"}
          value={"Sign Out"}
        />
      </form>
    </>
  );
};

export default Profile;
