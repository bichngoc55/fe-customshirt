import React, { useState, useEffect } from 'react';
import './Settings.css';
import { useDispatch, useSelector } from "react-redux";
import { FaCamera } from 'react-icons/fa';
import axios from "axios";
import { logoutUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert, Avatar } from "@mui/material";
import noImg from "../../assets/images/no_img.jpeg";

const Settings = () => {
  const { token, user } = useSelector((state) => state.auths);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.SDT || "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avaURL || noImg);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   // Update avatar URL when user data changes
  //   setAvatarUrl(user?.avaURL || noImg);
  // }, [user?.avaURL]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3005/user/${user._id}`,
        axiosConfig
      );

      if (response.status === 200) {
        const userData = response.data;
        // dispatch({ type: "UPDATE_USER", payload: userData });
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.SDT || "",
        });
        setAvatarUrl(userData.avaURL || noImg);
      }
    } catch (error) {
      setSnackbarMessage("Please login again");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'domdom');
    formData.append('cloud_name', 'dejoc5koc');

    try {
      const uploadResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dejoc5koc/image/upload',
        formData
      );

      const updateResponse = await axios.patch(
        `http://localhost:3005/user/${user._id}`,
        {
          avaURL: uploadResponse.data.secure_url
        },
        axiosConfig
      );

      if (updateResponse.status === 200) {
        const newAvatarUrl = uploadResponse.data.secure_url;
        setAvatarUrl(newAvatarUrl);
        // dispatch({
        //   type: 'UPDATE_USER',
        //   payload: {
        //     ...user,
        //     avaURL: newAvatarUrl
        //   }
        // });
        setSnackbarMessage("Profile image updated successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Failed to update profile image");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        name: formData.name,
        SDT: formData.phone
      };

      const response = await axios.patch(
        `http://localhost:3005/user/${user._id}`,
        updateData,
        axiosConfig
      );

      if (response.status === 200) {
        dispatch({
          type: 'UPDATE_USER',
          payload: {
            ...user,
            ...updateData
          }
        });
        setSnackbarMessage("Profile updated successfully");
        setSnackbarSeverity("success");
      }
    } catch (error) {
      setSnackbarMessage("Failed to update profile");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">Profile</div>
      
      <div className="profile-picture">
        <div 
          className="avatar-container"
          onMouseEnter={() => setShowCameraIcon(true)}
          onMouseLeave={() => setShowCameraIcon(false)}
        >
          <Avatar 
            src={avatarUrl} 
            alt="Profile"
            sx={{ 
              width: 80, 
              height: 80,
              position: 'relative'
            }}
          />
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="imageUpload" 
            className={`camera-icon ${showCameraIcon ? 'show' : ''}`}
          >
            <FaCamera size={25} color="#131720" />
          </label>
        </div>
        <div className='notice'>
          <span style={{ color: 'red' }}>*</span> The uploaded image must be <br />
          500px wide and 500px long
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
          />
        </div>
        
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
        
        <div className="save-button">
          <button type="submit">Save Changes</button>
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
    </div>
  );
};

export default Settings;