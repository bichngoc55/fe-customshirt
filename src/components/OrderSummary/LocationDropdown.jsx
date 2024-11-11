import React, { useMemo } from "react";
import { Select, MenuItem, FormHelperText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { provinces, districts } from "./vietnamLocations";

const CustomSelect = styled(Select)({
  width: "100%",
  "& .MuiSelect-select": {
    padding: "8px 32px 8px 16px",
    fontSize: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #ccc",
    "&:focus": {
      backgroundColor: "#fff",
      borderColor: "#4d4d4d",
    },
  },
  "& .MuiSvgIcon-root": {
    color: "#4d4d4d",
  },
});

const LocationDropdown = ({
  selectedProvince,
  selectedDistrict,
  onProvinceChange,
  onDistrictChange,
  error,
  helperText,
  required = false,
  className = "",
  disabled = false,
}) => {
  const filteredDistricts = useMemo(() => {
    return districts.filter(
      (district) => district.idProvince === selectedProvince
    );
  }, [selectedProvince]);

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    onProvinceChange(provinceId);
    onDistrictChange("");
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    onDistrictChange(districtId);
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div>
        <CustomSelect
          value={selectedProvince || ""}
          onChange={handleProvinceChange}
          error={error && !selectedProvince}
          required={required}
          disabled={disabled}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">
            <em>Chọn Tỉnh/Thành phố</em>
          </MenuItem>
          {provinces.map((province) => (
            <MenuItem key={province.idProvince} value={province.idProvince}>
              {province.name}
            </MenuItem>
          ))}
        </CustomSelect>
        {error && !selectedProvince && (
          <FormHelperText error>
            {helperText || "Vui lòng chọn Tỉnh/Thành phố"}
          </FormHelperText>
        )}
      </div>

      <div>
        <CustomSelect
          value={selectedDistrict || ""}
          onChange={handleDistrictChange}
          error={error && !selectedDistrict}
          required={required}
          disabled={!selectedProvince || disabled}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">
            <em>Chọn Quận/Huyện</em>
          </MenuItem>
          {filteredDistricts.map((district) => (
            <MenuItem key={district.idDistrict} value={district.idDistrict}>
              {district.name}
            </MenuItem>
          ))}
        </CustomSelect>
        {error && selectedProvince && !selectedDistrict && (
          <FormHelperText error>
            {helperText || "Vui lòng chọn Quận/Huyện"}
          </FormHelperText>
        )}
      </div>
    </div>
  );
};

export default LocationDropdown;
