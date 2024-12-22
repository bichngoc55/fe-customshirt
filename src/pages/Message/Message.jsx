import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import { Send, ArrowLeft, Trash2, Image as ImageIcon } from "lucide-react";
import "./Message.css";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Message = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useSelector((state) => state.auths);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const order = location.state?.order;
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [unsendDialogOpen, setUnsendDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?._id) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3005/message/conversation/${user._id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [user?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImageUpload = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() && !imageFile) return;

    const tempId = Date.now().toString();

    let imageUrl = null;
    setIsLoading(true);

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "domdom");
      formData.append("cloud_name", "dejoc5koc");

      try {
        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/dejoc5koc/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadResponse.data.secure_url;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        alert("Failed to upload image. Please try again.");
        return;
      }
    }

    const tempMessage = {
      _id: tempId,
      sender: user._id,
      content: newMessage,
      image: imageUrl,
      createdAt: new Date().toISOString(),
      status: "sending",
    };
    console.log("tempMessage", tempMessage);

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    clearImageUpload();

    try {
      const messageData = {
        receiverId: "6716e91039ea3d3dc8d3f65f",
        content: newMessage,
        image: imageUrl,
      };
      console.log("messageData", messageData);

      const response = await fetch(
        `http://localhost:3005/message/send/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );
      console.log("response :", response);

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await response.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...savedMessage, status: "sent" } : msg
        )
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...msg, status: "failed" } : msg
        )
      );

      alert("Failed to send message. Please try again.");
    }
  };

  const handleUnsendClick = (messageId) => {
    setSelectedMessageId(messageId);
    setUnsendDialogOpen(true);
  };

  const handleUnsendConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/message/unsend/${selectedMessageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unsend message");
      }

      const updatedMessage = await response.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === selectedMessageId
            ? { ...updatedMessage, status: "unsent" }
            : msg
        )
      );
    } catch (error) {
      console.error("Error unsending message:", error);
    }

    setUnsendDialogOpen(false);
    setSelectedMessageId(null);
  };
  const formatPrice = (price) => {
    if (price == null) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return (
    <div className="page-container">
      <div className="message-container">
        {/* Header */}
        <div className="message-header">
          <Button
            variant="text"
            className="back-button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="icon" />
          </Button>
          <h1>Customer Support</h1>
          <Button
            variant="text"
            className="delete-mode-button"
            onClick={() => setDeleteMode(!deleteMode)}
          >
            <Trash2 className={`icon ${deleteMode ? "delete-active" : ""}`} />
          </Button>
        </div>

        {/* Order Details Section */}
        {order && (
          <div className="order-details">
            <div className="order-info">
              <h2>Order Details</h2>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Product:</strong> {order.items[0].product.name}
              </p>
              <p>
                <strong>Total:</strong> {formatPrice(order.total)}đ
              </p>
              <p>
                <strong>Status:</strong> {order.deliveryStatus}
              </p>
            </div>
            <img src={order.items[0].product.imageUrl[0]} />
          </div>
        )}

        {/* Messages Container */}
        <div className="messages-wrapper">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`message-bubble ${
                message.sender === user._id
                  ? "customer-message"
                  : "admin-message"
              } ${
                message.status === "unsent" || message.isUnsent
                  ? "unsent-message"
                  : ""
              }`}
            >
              <div className="message-content">
                {!(message.status === "unsent" || message.isUnsent) &&
                  message.image && (
                    <img
                      src={message.image}
                      alt="Uploaded"
                      className="uploaded-image"
                    />
                  )}
                <p>
                  {message.isUnsent
                    ? "This message was unsent"
                    : message.content}
                </p>
                <div className="message-info">
                  <span className="message-timestamp">
                    {formatTimestamp(message.createdAt)}
                  </span>
                  {message.status === "sending" && (
                    <span className="message-status">Sending...</span>
                  )}
                  {message.status === "sent" && message.sender === user._id && (
                    <span className="message-status">Sent</span>
                  )}
                  {message.status === "failed" && (
                    <span className="message-status error">Failed to send</span>
                  )}
                </div>
              </div>

              {message.sender === user._id &&
                !message.isUnsent &&
                message.status !== "unsent" &&
                !deleteMode && (
                  <button
                    className="unsend-button"
                    onClick={() => handleUnsendClick(message._id)}
                  >
                    Unsend
                  </button>
                )}
            </div>
          ))}
          {order &&
            messages.length > 0 &&
            messages[messages.length - 1].sender === user._id && (
              <div className="order-details-preview">
                <div className="order-summary">
                  <img
                    src={order.items[0].product.imageUrl[0]}
                    alt="Product"
                    className="order-product-image"
                  />
                  <div className="order-info">
                    <p>
                      <strong>Order ID:</strong> {order._id}
                    </p>
                    <p>
                      <strong>Product:</strong> {order.items[0].product.name}
                    </p>
                    <p>
                      <strong>Total:</strong> {formatPrice(order.total)}đ
                    </p>
                    <p>
                      <strong>Status:</strong> {order.deliveryStatus}
                    </p>
                  </div>
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <Button onClick={clearImageUpload}>Remove</Button>
          </div>
        )}

        <form onSubmit={handleSend} className="message-input-container">
          <div className="message-input-wrapper">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                order
                  ? `Message about Order #${order._id} (${order.deliveryStatus})`
                  : "Type your message..."
              }
              className="message-input"
              disabled={deleteMode}
              fullWidth
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <Button
              onClick={() => fileInputRef.current.click()}
              className="image-upload-button"
              disabled={deleteMode}
            >
              <ImageIcon className="icon" />
            </Button>
            <Button
              type="submit"
              className="send-button"
              disabled={(!newMessage.trim() && !imageFile) || deleteMode}
            >
              {isLoading ? (
                <CircularProgress
                  size={24}
                  className="send-spinner"
                  color="inherit"
                />
              ) : (
                <Send className="icon" />
              )}
            </Button>
          </div>
        </form>
      </div>

      <Dialog
        open={unsendDialogOpen}
        onClose={() => setUnsendDialogOpen(false)}
      >
        <DialogTitle>Unsend Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unsend this message? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnsendDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUnsendConfirm} color="primary">
            Unsend
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Message;
