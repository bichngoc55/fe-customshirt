import React, { useState } from "react";
import "./Order.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Order = () => {
  const [orders, setOrders] = useState([
    { id: "OD001", phone: "033678051", date: "02/11/2024", total: 150000, status: "Chờ xác nhận", payment: "Đã thanh toán" },
    { id: "OD002", phone: "033678051", date: "02/11/2024", total: 200000, status: "Đã xác nhận", payment: "Chưa thanh toán" },
    { id: "OD003", phone: "033678051", date: "02/11/2024", total: 300000, status: "Đã xác nhận", payment: "Chưa thanh toán" },
    { id: "OD004", phone: "033678051", date: "02/11/2024", total: 4000000, status: "Chờ xác nhận", payment: "Đã thanh toán" },
    { id: "OD005", phone: "033678051", date: "02/11/2024", total: 250000, status: "Đã xác nhận", payment: "Chưa thanh toán" },
  ]);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const toggleSelectOrder = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((orderId) => orderId !== id) : [...prev, id]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  const deleteSelectedOrders = () => {
    setOrders(orders.filter((order) => !selectedOrders.includes(order.id)));
    setSelectedOrders([]);
  };

  const handleStatusClick = (event, orderId) => {
    setMenuAnchor(event.currentTarget);
    setCurrentOrderId(orderId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setCurrentOrderId(null);
  };

  const changeStatus = (newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === currentOrderId ? { ...order, status: newStatus } : order
      )
    );
    handleMenuClose();
  };

  return (
    <div className="order-container">
      <div className="order-header">
        <button onClick={selectAllOrders} className="action-btn">
          {selectedOrders.length === orders.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </button>
        <button onClick={deleteSelectedOrders} className="action-btn delete-all">
          Xóa
        </button>
      </div>
      <table className="order-table">
        <thead>
          <tr>
            <th>
              
            </th>
            <th>Mã đơn hàng</th>
            <th>SĐT khách hàng</th>
            <th>Ngày đặt hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => toggleSelectOrder(order.id)}
                />
              </td>
              <td>{order.id}</td>
              <td>{order.phone}</td>
              <td>{order.date}</td>
              <td>{order.total.toLocaleString("vi-VN")}</td>
              <td>
                <span
                  className={`status-badge ${order.status === "Chờ xác nhận" ? "pending" : "confirmed"}`}
                  onClick={(event) => handleStatusClick(event, order.id)}
                >
                  {order.status}
                </span>
              </td>
              <td>
                <span
                  className={`status-badge ${order.payment === "Đã thanh toán" ? "paid" : "unpaid"}`}
                >
                  {order.payment}
                </span>
              </td>
              <td className="action-column">
                <EditIcon className="icon-btn edit-btn" />
                <DeleteIcon className="icon-btn delete-btn" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Menu thay đổi trạng thái */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => changeStatus("Chờ xác nhận")}>Chờ xác nhận</MenuItem>
        <MenuItem onClick={() => changeStatus("Đã xác nhận")}>Đã xác nhận</MenuItem>
      </Menu>
    </div>
  );
};

export default Order;
