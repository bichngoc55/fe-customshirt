import React from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="contact-info">
          <p><LocationOnIcon className="contact-icons" /> Địa chỉ: Đường Hàn Thuyên, khu phố 6, Phường Thủ Đức, Thành phố Hồ Chí Minh</p>
          <p><PhoneIcon className="contact-icons"  /> Số điện thoại: 0338768930</p>
          <p><EmailIcon className="contact-icons"  /> Email: lenhe@dandom.com.me</p>
        </div>
        <div className="support">
          <h4>HỖ TRỢ KHÁCH HÀNG</h4>
          <p>Trang chủ</p>
          <p>Thiết kế</p>
          <p>Bộ sưu tập</p>
          <p>Đánh giá</p>
        </div>
        <div className="policies">
          <h4>CHÍNH SÁCH</h4>
          <p>Tìm kiếm</p>
          <p>Điều khoản sử dụng</p>
          <p>Danh sách dịch vụ</p>
          <p>Liên hệ</p>
        </div>
        <div className="social-media">
          <h4>MẠNG XÃ HỘI</h4>
          <div className="social-icons">
            <a href="#" style={{ color: '#1877F2'}}>
                <FacebookOutlinedIcon />
            </a>
            <a href="#" style={{ color: '#F44949'}}>
                <GoogleIcon />
            </a>
            <a href="#" style={{ color: '#5C6BC0' }}>
                <GitHubIcon />
            </a>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;