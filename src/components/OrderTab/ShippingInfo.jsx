import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Typography,
  styled,
  Alert,
  Snackbar,
  Container,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { provinces, districts } from "./vietnamLocations";
import CheckoutStepper from "./CheckoutStepper";
import { useDispatch, useSelector } from "react-redux";
import { setShippingData, setTotalFee } from "../../redux/shippingSlice";
const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.12)",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(140, 255, 179, 0.5)",
      borderWidth: "1px",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

const StyledSelect = styled(Select)(() => ({
  width: "100%",
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: "1px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(140, 255, 179, 0.5)",
    borderWidth: "1px",
  },
  "& .MuiSelect-icon": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiSelect-select": {
    padding: "14px",
  },
}));

const StyledMenuItem = styled(MenuItem)({
  "&:hover": {
    backgroundColor: "rgba(140, 255, 179, 0.1)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(140, 255, 179, 0.2)",
    "&:hover": {
      backgroundColor: "rgba(140, 255, 179, 0.3)",
    },
  },
});

const ShippingInfo = ({ onNextStep }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const { shippingData } = useSelector((state) => state.shipping);

  const [availableDistricts, setAvailableDistricts] = useState([]);
  const dispatch = useDispatch();
  //   const [formData, setFormData] = useState({
  //     name: "",
  //     email: "",
  //     phone: "",
  //     province: "",
  //     district: "",
  //     address: "",
  //   });
  const [formData, setFormData] = useState(shippingData);
  const getLocationNames = (provinceId, districtId) => {
    const province = provinces.find((p) => p.idProvince === provinceId);
    const district = districts.find((d) => d.idDistrict === districtId);
    return {
      provinceName: province ? province.name : "",
      districtName: district ? district.name : "",
    };
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "province") {
      setFormData((prev) => ({
        ...prev,
        district: "",
      }));

      const filteredDistricts = districts.filter(
        (district) => district.idProvince === value
      );
      setAvailableDistricts(filteredDistricts);
    }
  };

  const validateForm = () => {
    const required = [
      "name",
      "email",
      "phone",
      "province",
      "district",
      "address",
    ];
    const empty = required.filter((field) => !formData[field]);

    if (empty.length > 0) {
      setSnackbarMessage("Please fill in all required fields");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbarMessage("Please enter a valid email address");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return false;
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setSnackbarMessage("Please enter a valid phone number");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { provinceName, districtName } = getLocationNames(
        formData.province,
        formData.district
      );
      const formattedData = {
        ...formData,
        provinceId: formData.province,
        districtId: formData.district,
        province: provinceName,
        district: districtName,
      };
      localStorage.setItem("shippingData", JSON.stringify(formData));
      dispatch(setShippingData(formattedData));
      onNextStep();
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("shippingData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      if (parsedData.province) {
        const filteredDistricts = districts.filter(
          (district) => district.idProvince === parsedData.province
        );
        setAvailableDistricts(filteredDistricts);
      }
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CheckoutStepper currentStep={1} />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          borderRadius: "15px",
          width: "100%",
          paddingLeft: "20px",
          mt: 4,
        }}
      >
        <div className="contact-details">
          <Box sx={{ padding: "20px" }}>
            <Typography
              sx={{
                color: "#C8FFF6",
                fontSize: "25px",
                fontWeight: "bold",
                mb: 3,
              }}
            >
              Contact Details
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: "#C8FFF6",
                fontFamily: "Montserrat",
                fontWeight: "bold",
              }}
            >
              Name
            </Typography>
            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="Enter your name..."
              value={formData.name}
              onChange={handleChange("name")}
              sx={{ mb: 2 }}
            />

            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: "#C8FFF6",
                fontFamily: "Montserrat",
                fontWeight: "bold",
              }}
            >
              Email
            </Typography>
            <StyledTextField
              fullWidth
              type="email"
              variant="outlined"
              placeholder="Enter your email..."
              value={formData.email}
              onChange={handleChange("email")}
              sx={{ mb: 2 }}
            />

            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: "#C8FFF6",
                fontFamily: "Montserrat",
                fontWeight: "bold",
              }}
            >
              Phone Number
            </Typography>
            <StyledTextField
              variant="outlined"
              type="tel"
              fullWidth
              value={formData.phone}
              onChange={handleChange("phone")}
              placeholder="Enter your phone number..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: "white" }}>+84</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </div>

        <div className="shipping-details">
          <Box sx={{ padding: "20px" }}>
            <Typography
              sx={{
                color: "#C8FFF6",
                fontSize: "25px",
                fontWeight: "bold",
                mb: 3,
              }}
            >
              Shipping Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: "#C8FFF6",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  }}
                >
                  Province/City
                </Typography>
                <StyledSelect
                  value={formData.province}
                  onChange={handleChange("province")}
                  displayEmpty
                >
                  <StyledMenuItem value="">
                    <em>Select Province</em>
                  </StyledMenuItem>
                  {provinces.map((province) => (
                    <StyledMenuItem
                      key={province.idProvince}
                      value={province.idProvince}
                    >
                      {province.name}
                    </StyledMenuItem>
                  ))}
                </StyledSelect>
              </FormControl>

              <FormControl fullWidth>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: "#C8FFF6",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  }}
                >
                  District
                </Typography>
                <StyledSelect
                  value={formData.district}
                  onChange={handleChange("district")}
                  disabled={!formData.province}
                  displayEmpty
                >
                  <StyledMenuItem value="">
                    <em>Select District</em>
                  </StyledMenuItem>
                  {availableDistricts.map((district) => (
                    <StyledMenuItem
                      key={district.idDistrict}
                      value={district.idDistrict}
                    >
                      {district.name}
                    </StyledMenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Box>

            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: "#C8FFF6",
                fontFamily: "Montserrat",
                fontWeight: "bold",
              }}
            >
              Detailed Address
            </Typography>
            <StyledTextField
              fullWidth
              variant="outlined"
              value={formData.address}
              onChange={handleChange("address")}
              multiline
              rows={3}
              placeholder="Enter your detailed address..."
            />
          </Box>
        </div>

        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="contained"
            color="success"
            type="submit"
            sx={{
              minWidth: "150px",
              height: "48px",
              textTransform: "none",
              fontSize: "16px",
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>

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
    </Container>
  );
};

export default ShippingInfo;
