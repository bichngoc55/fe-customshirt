import React, { useState } from "react";
import {
  Avatar,
  styled,
  TextField,
  Box,
  InputAdornment,
  Typography,
  Button,
} from "@mui/material";
import BtnComponent from "../../components/btnComponent/btnComponent";
import noImg from "../../assets/images/no_img.jpeg";
import { useSelector } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
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
  const { user } = useSelector((state) => state.auths);
  const [file, setFile] = useState(null);
  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

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
            {user?.username}
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontFamily: "Montserrat",
              color: "#808080",
            }}
          >
            {user?.email}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{
            color: "white",
            fontFamily: "Montserrat",
            borderColor: "rgba(255, 255, 255, 0.12)",
            borderWidth: "1px",
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          Choose Image
          <VisuallyHiddenInput
            multiple
            type="file"
            onChange={handleImageChange}
          />
        </Button>

        {file && (
          <Box
            sx={{
              display: "flex",
              width: "100px",
              height: "100px",
              overflow: "hidden",
              borderRadius: 1,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundImage: `url(${URL.createObjectURL(file)})`,
            }}
          />
        )}
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
          // label="Full Name"
          // placeholder="Your full name"
          variant="outlined"
          value={user.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <p style={{ color: "white" }}>+84</p>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
        <StyledInputForm
          // label="Phone number"
          // placeholder="Your phone number"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <p style={{ color: "white" }}>+84</p>
              </InputAdornment>
            ),
          }}
          value={user.SDT}
        />
        {/* <StyledInputForm
          label="Current password"
          placeholder="Your current password"
          type="password"
          variant="outlined"
          // value={user.}
          fullWidth
        /> */}
        <StyledInputForm
          // label="Current Address"
          // placeholder="Your current address"
          variant="outlined"
          value={user.address}
          aria-readonly
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <p style={{ color: "white" }}>+84</p>
              </InputAdornment>
            ),
          }}
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
