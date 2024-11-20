import React, { useState } from "react";
import "./Message.css";

const users = [
  { id: 1, name: "Bảo Linh", status: "online", unread: 5 },
  { id: 2, name: "Bảo Linh", status: "offline", unread: 0 },
  { id: 3, name: "Bảo Linh", status: "online", unread: 7 },
  { id: 4, name: "Bảo Linh", status: "offline", unread: 0 },
];

const messages = [
  { id: 1, text: "Có thể tư vấn cho tôi được không ?", time: "10:22", type: "received" },
  { id: 2, text: "Dĩ nhiên rồi, bạn muốn tư vấn về gì nào ?", time: "10:24", type: "sent" },
  { id: 3, text: "Sản phẩm 'không tin đàn ông' còn hàng không ạ ?", time: "10:26", type: "received" },
  { id: 4, text: "Hiện tại sản phẩm đã cháy hàng rồi ạ.", time: "10:30", type: "sent" },
  { id: 5, text: "Okay cảm ơn shop :>", time: "10:32", type: "received" },
];

const Message = () => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      alert(`Message sent: ${input}`);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className={`user-item ${user.unread > 0 ? "active" : ""}`}>
            <div className="user-avatar"></div>
            <div>{user.name}</div>
            <div className={`user-status ${user.status === "offline" ? "offline" : ""}`}></div>
            {user.unread > 0 && <div className="unread-count">{user.unread}</div>}
          </div>
        ))}
      </div>
      <div className="chat-area">
        <div className="chat-header">Bảo Linh</div>
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              {msg.text}
              <div className="message-time">{msg.time}</div>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Start typing here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="send-button" onClick={handleSend}>
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
