import React, { useState } from 'react';
import './collectionPage.css';
import noImg from '../../assets/images/no_img.jpeg';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { AdvancedImage } from '@cloudinary/react';

const CollectionPage = () => {
  const [price, setPrice] = useState(500000); // Khởi tạo giá mặc định
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');

  
  const products = [
    { id: 1, name: 'Capybara T-Shirt', price: '$26.00 - $29.00', img: noImg, labels: ['Sale', 'New'] },
    { id: 2, name: 'Capybara T-Shirt', price: '$26.00 - $29.00', img: 'path/to/image2.jpg', labels: ['Sale', 'New'] },
    { id: 3, name: 'Capybara T-Shirt', price: '$26.00 - $29.00', img: 'path/to/image3.jpg', labels: ['Sale', 'New'] },
    { id: 4, name: 'Capybara T-Shirt', price: '$28.00', img: 'path/to/image4.jpg', labels: ['Sale', 'Hot'] },
    { id: 5, name: 'Capybara T-Shirt', price: '$26.00 - $29.00', img: 'path/to/image5.jpg', labels: ['Sale', 'New'] },
    { id: 6, name: 'Capybara T-Shirt', price: '$28.00', img: 'path/to/image6.jpg', labels: ['Hot'] },
  ];

  const handleRangeChange = (event) => {
    setPrice(event.target.value);
  };

  const formatPrice = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'domdom');  
    formData.append("cloud_name", "dejoc5koc");

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/dejoc5koc/image/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
      });
      console.log("ehhehehe:", response)
      setUrl(response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="collection">
      <aside className="sidebar">
        <div className="search-section">
          <h2>Search</h2>
          <div className="search-input">
            <input type="text" placeholder="Search products..." />
            <SearchIcon className="search-icon" />
          </div>
        </div> 
        <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Upload Image</button>
      {url && <img src={url} alt="Uploaded" style={{ width: '200px', marginTop: '20px' }} />}
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

        <div className="filter-section">
          <h2>Filter by Color</h2>
          <div className="color-options">
            <label><span className="color-circle black"></span>Black<span className="count">14</span></label>
            <label><span className="color-circle white"></span>White<span className="count">13</span></label>
          </div>
        </div>

        <div className="filter-section">
          <h2>Filter by Size</h2>
          {['2XL', '3XL', 'L', 'M', 'S', 'XL'].map((size) => (
            <label key={size}>{size}<span className="count">14</span></label>
          ))}
        </div>

        <div className="filter-section">
          <h2>Sort by</h2>
          {['Popularity', 'Average rating', 'Latest', 'Price: low to high', 'Price: high to low'].map((option) => (
            <label key={option}>{option}</label>
          ))}
        </div>

        <div className="filter-section">
          <h2>Stock status</h2>
          {['On sale', 'In stock', 'Out of stock'].map((status) => (
            <label key={status}><input type="checkbox" /> {status}</label>
          ))}
        </div>
      </aside>

      <main className="product-grid">
        <div className="product-header">
          <p>Showing 1-12 of 20 results</p>
          <select>
            <option>Default sorting</option>
          </select>
        </div>
        <div className="products">
          {products.map((product) => (
            <div key={product.id} className="product">
              <div className="product-labels">
                {product.labels.map((label) => (
                  <span key={label} className={`label-${label.toLowerCase()}`}>{label}</span>
                ))}
              </div>
              <img src={product.img} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;