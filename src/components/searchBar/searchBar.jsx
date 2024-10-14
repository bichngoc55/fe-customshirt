import React, { useState } from "react";

const SearchBar = ({ onSearch, placeholder, searchType }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, searchType);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder || "Tìm kiếm..."}
      />
      <button type="submit">Tìm kiếm</button>
    </form>
  );
};

export default SearchBar;
