import React, { useState, useEffect } from "react";
import "./Order.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, deleteOrder, updateOrder } from "../../redux/orderSlice";
import ModalUpdateOrder from "../../components/ModalUpdateOrder/ModalUpdateOrder";

const Order = () => {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.orders);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const toggleSelectOrder = (id) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  const selectAllOrders = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length ? [] : orders.map(order => order._id)
    );

  };

  const deleteSelectedOrders = () => {
    selectedOrders.forEach(id => dispatch(deleteOrder(id)));
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
    if (currentOrderId) {
      dispatch(updateOrder({
        id: currentOrderId,
        orderData: { orderStatus: newStatus }
      }));
    }
    handleMenuClose();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (field) => {
    setSortField(field);
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getFilteredAndSortedOrders = () => {
    let filtered = orders?.filter(order => 
      order.userInfo.phone.includes(searchQuery)
    ) || [];

    if (sortField === "total") {
      filtered.sort((a, b) => a.total - b.total);
    } else if (sortField === "date") {
      filtered.sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate));
    }

    return filtered;
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const filteredOrders = getFilteredAndSortedOrders();

  return (
    <div className="order-container">
      <div className="order-header">
        <div>
          <button onClick={selectAllOrders} className="action-btn">
            {selectedOrders.length === orders?.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
          <button onClick={deleteSelectedOrders} className="action-btn delete-all">
            Xóa
          </button>
        </div>
        <div className="sort-search">
          <select onChange={(e) => handleSort(e.target.value)} className="sort-dropdown">
            <option value="date">Ngày đặt hàng</option>
            <option value="total">Tổng tiền</option>
          </select>
          <div className="looking-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo SĐT"
              value={searchQuery}
              onChange={handleSearch}
              className="looking-input"
            />
            {/* <div className="looking-icon">
              <i className="fa fa-search"></i>
            </div> */}
          </div>
        </div>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th></th>
            <th>Mã đơn hàng</th>
            <th>Khách hàng</th>
            <th>SĐT</th>
            <th>Ngày đặt hàng</th>
            <th>Phương thức thanh toán</th>
            <th>Tổng tiền</th>
            <th>Trạng thái đơn hàng</th>
            <th>Thanh toán</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => toggleSelectOrder(order._id)}
                />
              </td>
              <td>{order._id.slice(-6)}</td>
              <td>{order.userInfo.name}</td>
              <td>{order.userInfo.phone}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{order.paymentDetails.method}</td>
              <td>{(order.total + order.shippingFee).toLocaleString("vi-VN")}đ</td>
              <td>
                <span
                  className={`status-badge ${order.orderStatus}`}
                  onClick={(event) => handleStatusClick(event, order._id)}
                >
                  {order.orderStatus}
                </span>
              </td>
              <td>
                <span className={`status-badge ${order.paymentDetails.status}`}>
                  {order.paymentDetails.status}
                </span>
              </td>
              <td className="action-column">
                <EditIcon className="icon-btn edit-btn"
                onClick={() => handleEditClick(order)} />
                <DeleteIcon 
                  className="icon-btn delete-btn" 
                  onClick={() => dispatch(deleteOrder(order._id))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Menu 
        anchorEl={menuAnchor} 
        open={Boolean(menuAnchor)} 
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => changeStatus("processing")}>processing</MenuItem>
        <MenuItem onClick={() => changeStatus("confirmed")}>confirmed</MenuItem>
        <MenuItem onClick={() => changeStatus("refused")}>refused</MenuItem>
      </Menu>
      <ModalUpdateOrder
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        order={selectedOrder}
        onUpdate={(id, orderData) => dispatch(updateOrder({ id, orderData }))}
/>
    </div>
  );
};

export default Order;