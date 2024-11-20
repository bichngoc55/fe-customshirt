import React, { useState } from "react";
import "./User.css";

const UserTable = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const users = [
    { status: "Active", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Down", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Active", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Active", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Active", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Down", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Active", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Down", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Down", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Active", name: "BaoLinh", email: "baolinh@gmail.com" },
    { status: "Active", name: "BaoLinh", email: "baolinh@gmail.com" },
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>Account Status</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>
                <span className={`account-status ${user.status === "Active" ? "status-active" : "status-down"}`}>
                  {user.status}
                </span>
              </td>
              <td>
                <div className="user-details">
                  <div className="user-avatar"></div>
                  <span>{user.name}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>
                <div className="action-btn-more" onClick={() => toggleDropdown(index)}>
                  <span>•••</span>
                  {activeDropdown === index && (
                    <div className="dropdown-menu active">
                      <div className="dropdown-item chat">Chat</div>
                      <div className="dropdown-item report">Report User</div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="view-more">
        <button>View More</button>
      </div>
    </div>
  );
};

export default UserTable;
