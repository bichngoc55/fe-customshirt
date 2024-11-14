import React, { useEffect, useState } from "react";
import "./collectionPage.css";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { Box, Typography, IconButton } from "@mui/material";
import ModalAddProduct from "../../components/ModalAddProduct/ModalAddProduct";
import { useNavigate } from "react-router-dom";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
const CollectionPage = () => {
  const [price, setPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [imageUrl2, setImageUrl] = useState([]);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState([]);
  const [price2, setPrice2] = useState(500000);
  const [color, setColor] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isNewShirt, setIsNewShirt] = useState(true);
  const [isSale, setIsSale] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedStockStatus, setSelectedStockStatus] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [salePercent, setSalePercent] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");

  // handleFetch
  const handleFetch = async () => {
    try {
      const response = await fetch("http://localhost:3005/shirt/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setProducts(data);
        setFilteredProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    handleFetch();
  }, []);
  const handleProductClick = async (product) => {
    navigate(`/collection/${product._id}`, { state: { product } });
  };

  const handleModalOpenClick = () => {
    setIsOpenModal(true);
  };

  const formatPrice = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handleImageUpload = async (files2) => {
    try {
      const uploadedUrls = await Promise.all(
        files2.map(async (image) => {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "domdom");
          formData.append("cloud_name", "dejoc5koc");

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dejoc5koc/image/upload`,
            formData
          );

          return response.data.secure_url;
        })
      );
      // setImageUrl(uploadedUrls);
      // console.log("All image URLs:", uploadedUrls);
      const response = await fetch(`http://localhost:3005/shirt/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price2,
          imageUrl: uploadedUrls,
          quantity,
          salePercent,
          color,
          isSale,
          isNewShirt,
          size,
        }),
      });

      if (response.ok) {
        alert("Product added successfully!");
        setName("");
        setDescription("");
        setPrice2(0);
        setColor("");
        setSize("");
        setSalePercent(0);
        setQuantity(0);
        setImageUrl("");
        setImageUrl(null);
        setIsOpenModal(false);
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  //  handle Filter
  // Search handler
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, selectedSizes, price, selectedStockStatus, sortOption);
  };
  const handleColorFilter = (color) => {
    const newColor = selectedColor === color ? "" : color;
    setSelectedColor(newColor);
    filterProducts(
      searchTerm,
      selectedSizes,
      price,
      selectedStockStatus,
      sortOption,
      newColor
    );
  };
  const handleRangeChange = (event) => {
    const newPrice = parseInt(event.target.value);
    setPrice(newPrice);
    filterProducts(
      searchTerm,
      selectedSizes,
      newPrice,
      selectedStockStatus,
      sortOption
    );
  };

  const handleSizeFilter = (size) => {
    const newSelectedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSelectedSizes);
    filterProducts(
      searchTerm,
      newSelectedSizes,
      price,
      selectedStockStatus,
      sortOption
    );
  };

  const handleStockStatusFilter = (status) => {
    const newStatus = selectedStockStatus === status ? "" : status;
    setSelectedStockStatus(newStatus);
    filterProducts(searchTerm, selectedSizes, price, newStatus, sortOption);
  };

  const handleSort = (option) => {
    setSortOption(option);
    filterProducts(
      searchTerm,
      selectedSizes,
      price,
      selectedStockStatus,
      option
    );
  };

  const filterProducts = (
    search,
    sizes,
    maxPrice,
    stockStatus,
    sort,
    color
  ) => {
    let filtered = [...products];

    // Apply search filter
    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply size filter
    if (sizes.length > 0) {
      filtered = filtered.filter((product) =>
        sizes.some((size) => product.size.includes(size))
      );
    }
    if (color) {
      filtered = filtered.filter((product) => product.color.includes(color));
    }

    // Apply price filter
    if (maxPrice > 0) {
      filtered = filtered.filter((product) => product.price <= maxPrice);
    }

    // Apply stock status filter
    if (stockStatus) {
      switch (stockStatus) {
        case "On sale":
          filtered = filtered.filter((product) => product.isSale);
          break;
        case "In stock":
          filtered = filtered.filter((product) => product.quantity > 0);
          break;
        case "Out of stock":
          filtered = filtered.filter((product) => product.quantity === 0);
          break;
        default:
          break;
      }
    }
    switch (sort) {
      case "Price: low to high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "Price: high to low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "Latest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };
  const handleFindProductWithImage = () => {};
  const ColorFilterSection = () => (
    <div className="filter-section">
      <h2>Filter by Color</h2>
      <div className="color-options">
        {["black", "white"].map((color) => (
          <label key={color} className="color-radio-label">
            <input
              type="radio"
              name="color"
              value={color}
              checked={selectedColor === color}
              onChange={() => handleColorFilter(color)}
            />
            <span className="radio-label-text">
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="collection">
      <aside className="sidebar">
        <div className="search-section" style={{ marginRight: "20px" }}>
          <h2>Search</h2>
          <div className="search-input">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <SearchIcon className="search-icon" />
          </div>
        </div>

        <div className="filter-section">
          <h2>Filter by price</h2>
          <input
            type="range"
            min="0"
            max="500000"
            step="50000"
            value={price}
            onChange={handleRangeChange}
          />
          <p>Price: {formatPrice(price)} </p>
          <button className="filter-button">Filter</button>
        </div>

        {/* <div className="filter-section">
        <h2>Filter by Color</h2>
        
      </div> */}
        <ColorFilterSection />
        <div className="filter-section">
          <h2>Filter by Size</h2>
          {["XXL", "XL", "L", "M", "S"].map((sizeOption) => (
            <label key={sizeOption}>
              <input
                type="checkbox"
                checked={selectedSizes.includes(sizeOption)}
                onChange={() => handleSizeFilter(sizeOption)}
              />
              {sizeOption}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h2>Sort by</h2>
          {[
            "Default sorting",
            "Price: low to high",
            "Price: high to low",
            "Latest",
          ].map((option) => (
            <label
              key={option}
              onClick={() => handleSort(option)}
              style={{
                fontWeight: sortOption === option ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {option}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h2>Stock status</h2>
          {["On sale", "In stock", "Out of stock"].map((status) => (
            <label key={status}>
              <input
                type="checkbox"
                checked={selectedStockStatus === status}
                onChange={() => handleStockStatusFilter(status)}
              />{" "}
              {status}
            </label>
          ))}
        </div>
      </aside>

      <main className="product-grid">
        <div className="product-header">
          <p>
            Showing {filteredProducts.length} of {products.length} results
          </p>

          <IconButton onClick={handleFindProductWithImage}>
            <CenterFocusWeakIcon sx={{ color: "white" }} />
          </IconButton>
        </div>
        <Box
          className="button"
          sx={{
            // marginBottom: "20px",
            // left: "0px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", textAlign: "center" }}>
            <IconButton onClick={handleModalOpenClick}>
              <AddIcon sx={{ color: "#8CFFB3" }} />
            </IconButton>
            <Typography
              mt={"10px"}
              sx={{
                color: "white",
                fontSize: "0.8rem",
                fontFamily: "Montserrat",

                // textAlign: "center",
              }}
            >
              Add
            </Typography>
          </div>
          {isOpenModal && (
            <ModalAddProduct
              isModalOpen={isOpenModal}
              setIsModalOpen={setIsOpenModal}
              setName={setName}
              setDescription={setDescription}
              setPrice={setPrice2}
              setColor={setColor}
              setSize={setSize}
              images={images}
              setImages={setImages}
              setQuantity={setQuantity}
              setSalePercent={setSalePercent}
              setIsNew={setIsNewShirt}
              setIsSale={setIsSale}
              handleImageUpload={handleImageUpload}
            />
          )}
        </Box>
        <div className="products">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="product"
              onClick={() => {
                handleProductClick(product);
              }}
            >
              <div className="product-labels">
                {product.isSale && <span className="label-sale">Sale</span>}
                {product.isNewShirt && <span className="label-new">New</span>}
              </div>
              <div className="product-images">
                {product.imageUrl.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} - view ${index + 1}`}
                  />
                ))}
              </div>
              <h3>{product.name}</h3>
              <p className="product-price">{formatPrice(product.price)} VND</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;
