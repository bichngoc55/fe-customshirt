import React, { useState, useEffect } from 'react';
import './LocationDropdown.css';
import { provinces, districts } from '../OrderTab/vietnamLocations';
 

const LocationDropdown = ({ onProvinceChange, onDistrictChange }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState([]);

  useEffect(() => {
    if (selectedProvince) {
      const filteredDistricts = districts.filter(
        district => district.idProvince === selectedProvince
      );
      setAvailableDistricts(filteredDistricts);
      setSelectedDistrict("");  
    }
  }, [selectedProvince]);

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    onProvinceChange?.(provinceId);
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    onDistrictChange?.(districtId);
  };

  return (
    <div className="location-selector-container">
      <div className="location-group">
        <label className="location-label">Province</label>
        <select
          className="location-select"
          value={selectedProvince}
          onChange={handleProvinceChange}
        >
          <option value="">Select Province</option>
          {provinces.map((province) => (
            <option key={province.idProvince} value={province.idProvince}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      <div className="location-group">
        <label className="location-label">District</label>
        <select
          className="location-select"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
        >
          <option value="">Select District</option>
          {availableDistricts.map((district) => (
            <option key={district.idDistrict} value={district.idDistrict}>
              {district.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationDropdown;