import React, { useState } from 'react';
import './Settings.css';
import { FaCamera } from 'react-icons/fa';

const Settings = () => {
  const [name, setName] = useState("Helo");
  const [email, setEmail] = useState("abc@gmail.com");
  const [phone, setPhone] = useState("+234 567 890");

  return (
    <div className="profile-container">
      <div className="profile-header">Profile</div>
      
      <div className="profile-picture">
        <div className="avatar">
          <FaCamera size={25} color="#131720" />
        </div>
        <div className='notice'>
        <span style={{ color: 'red' }}>*</span> The uploaded image must be <br /> 500px wide and 500px long
        </div>
      </div>
      
      <form>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        
        <div className="form-group">
          <label>Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        
        <div className="save-button">
          <button type="button">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
