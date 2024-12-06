import React, { useEffect, useState } from "react";
import {
  Avatar,
  styled,
  TextField,
  Box,
  InputAdornment,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import BtnComponent from "../../components/btnComponent/btnComponent";
import noImg from "../../assets/images/no_img.jpeg";
import { useDispatch, useSelector } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import axios from "axios";
import { logoutUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

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

const StyledInputForm = styled(TextField)(({}) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F9F9F9",
    // backgroundColor: "grey",
    color: "white",
    fontFamily: "Montserrat",
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
      color: "white",
      opacity: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
    marginBottom: "8px",
  },
}));

const Profile = () => {
  const { token, user } = useSelector((state) => state.auths);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState({
    name: false,
    phoneNumber: false,
    address: false,
  });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.SDT || "",
    address: user?.address || "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3005/user/${user._id}`,
        axiosConfig
      );

      if (response.status === 200) {
        const userData = response.data;
        dispatch({ type: "UPDATE_USER", payload: userData });
        setFormData({
          name: userData.name || "",
          phoneNumber: userData.SDT || "",
          address: userData.address || "",
        });
      }
    } catch (error) {
      console.error("Please login again", error);
      setSnackbarMessage("Please login again");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      dispatch(logoutUser());
      navigate("/login");
    }
  };
  const handlePencilClick = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: true,
    }));
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async (field) => {
    try {
      let updatePayload = {};
      switch (field) {
        case "phoneNumber":
          updatePayload = { SDT: formData[field] };
          break;
        case "name":
        case "address":
          updatePayload = { [field]: formData[field] };
          break;
        default:
          throw new Error("Invalid field");
      }

      const response = await axios.patch(
        `http://localhost:3005/user/${user._id}`,
        updatePayload,
        axiosConfig
      );

      if (response.status === 200) {
        dispatch({
          type: "UPDATE_USER",
          payload: {
            ...user,
            ...updatePayload,
            ...(field === "phoneNumber" ? { SDT: formData[field] } : {}),
          },
        });
        setSnackbarMessage(`${field} updated successfully`);
        setSnackbarSeverity("success");
        setEditMode((prev) => ({
          ...prev,
          [field]: false,
        }));
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      setSnackbarMessage(`Failed to update ${field}`);
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "domdom");
    formData.append("cloud_name", "dejoc5koc");

    try {
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dejoc5koc/image/upload`,
        formData
      );

      const updateResponse = await axios.patch(
        `http://localhost:3005/user/${user._id}`,
        {
          avaURL: uploadResponse.data.secure_url,
        },
        axiosConfig
      );

      if (updateResponse.status === 200) {
        dispatch({
          type: "UPDATE_USER",
          payload: {
            ...user,
            avaURL: uploadResponse.data.secure_url,
          },
        });
        setSnackbarMessage("Profile image updated successfully");
        setSnackbarSeverity("success");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      setSnackbarMessage("Failed to update profile image");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

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
        <Avatar src={user?.avaURL || noImg} sx={{ width: 50, height: 50 }} />
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
          <VisuallyHiddenInput type="file" onChange={handleImageChange} />
        </Button>
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
          placeholder="Your full name"
          variant="outlined"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          disabled={!editMode.name}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {editMode.name ? (
                  <Button
                    onClick={() => handleUpdate("name")}
                    sx={{ color: "black", minWidth: "auto" }}
                  >
                    Save
                  </Button>
                ) : (
                  <BorderColorOutlinedIcon
                    sx={{ color: "black", cursor: "pointer" }}
                    onClick={() => handlePencilClick("name")}
                  />
                )}
              </InputAdornment>
            ),
          }}
          fullWidth
        />

        <StyledInputForm
          // label="Phone number"
          placeholder="Your phone number"
          variant="outlined"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          disabled={!editMode.phoneNumber}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {editMode.phoneNumber ? (
                  <Button
                    onClick={() => handleUpdate("phoneNumber")}
                    sx={{ color: "black", minWidth: "auto" }}
                  >
                    Save
                  </Button>
                ) : (
                  <BorderColorOutlinedIcon
                    sx={{ color: "black", cursor: "pointer" }}
                    onClick={() => handlePencilClick("phoneNumber")}
                  />
                )}
              </InputAdornment>
            ),
          }}
          fullWidth
        />

        <StyledInputForm
          variant="outlined"
          value={formData.address}
          placeholder="Your address"
          onChange={(e) => handleInputChange("address", e.target.value)}
          disabled={!editMode.address}
          InputProps={{
            // readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                {editMode.address ? (
                  <Button
                    onClick={() => handleUpdate("address")}
                    sx={{ color: "black", minWidth: "auto" }}
                  >
                    Save
                  </Button>
                ) : (
                  <BorderColorOutlinedIcon
                    sx={{ color: "black", cursor: "pointer" }}
                    onClick={() => handlePencilClick("address")}
                  />
                )}
              </InputAdornment>
            ),
          }}
          fullWidth
        />
        <div className="" style={{ margin: "auto" }}>
          <BtnComponent
            handleClick={async () => {
              await dispatch(logoutUser());
              navigate("/login");
            }}
            width={"100%"}
            height={"40px"}
            value={"Log Out"}
          />
        </div>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
