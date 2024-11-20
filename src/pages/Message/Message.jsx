import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { Send, ArrowLeft, Trash2 } from "lucide-react";
import "./Message.css";
import { useSelector } from "react-redux";

const Message = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useSelector((state) => state.auths);
  const [messages, setMessages] = useState([
    {
      _id: 1,
      sender: "admin",
      content: "Hello! How can I help you today?",
      timestamp: Date.now(),
      status: "sent",
    },
  ]);

  const messagesEndRef = useRef(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [unsendDialogOpen, setUnsendDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/message/conversation/${user?._id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          console.log("Fetched messages:", response);
          const data = await response.json();
          console.log("Fetched messages:", data);
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (user?._id) {
      fetchMessages();
    }
  }, [user?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        sender: "customer",
        content: newMessage,
        timestamp: formatTimestamp(),
        status: "sending",
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");

      try {
        const response = await fetch(
          `http://localhost:3005/message/send/${user?._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              receiverId: "6716e91039ea3d3dc8d3f65f",
              content: newMessage,
            }),
          }
        );

        if (response.ok) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newMsg.id ? { ...msg, status: "sent" } : msg
            )
          );
          if (
            messages.length === 1 &&
            messages[0].sender === "6716e91039ea3d3dc8d3f65f"
          ) {
            setMessages((prev) => [
              ...prev,
              {
                _id: Date.now(),
                sender: "admin",
                content: "Hello! How can I help you today?",
                timestamp: formatTimestamp(),
                status: "sent",
              },
            ]);
          }
        } else {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMsg.id ? { ...msg, status: "failed" } : msg
          )
        );
      }
    }
  };

  const handleUnsendClick = (messageId) => {
    setSelectedMessageId(messageId);
    setUnsendDialogOpen(true);
  };

  const handleUnsendConfirm = () => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === selectedMessageId
          ? { ...msg, status: "unsent", content: "This message was unsent" }
          : msg
      )
    );
    setUnsendDialogOpen(false);
    setSelectedMessageId(null);
  };

  const handleDelete = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  return (
    <div className="page-container">
      <div className="message-container">
        {/* Header */}
        <div className="message-header">
          <Button
            variant="ghost"
            sx={{ color: "white" }}
            size="icon"
            className="back-button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft s className=" " />
          </Button>
          <h1>Customer Support</h1>
          <Button
            variant="ghost"
            size="icon"
            className="delete-mode-button"
            onClick={() => setDeleteMode(!deleteMode)}
          >
            <Trash2 className={`h-5 w-5 ${deleteMode ? "text-red-500" : ""}`} />
          </Button>
        </div>

        {/* Messages Container */}
        <div className="messages-wrapper">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-bubble ${
                message.sender !== "6716e91039ea3d3dc8d3f65f"
                  ? "customer-message"
                  : "admin-message"
              } ${message.status === "unsent" ? "unsent-message" : ""}`}
            >
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-timestamp">
                  {message.timestamp}
                  {message.status === "sending" && " • Sending..."}
                  {message.status === "sent" &&
                    message.sender === "customer" &&
                    " • Sent"}
                </span>
              </div>

              {message.sender === "customer" &&
                message.status === "sent" &&
                !deleteMode && (
                  <button
                    className="unsend-button"
                    onClick={() => handleUnsendClick(message._id)}
                  >
                    Unsend
                  </button>
                )}

              {deleteMode && message.sender === "customer" && (
                <button
                  className="delete-button"
                  onClick={() => handleDelete(message.id)}
                >
                  <Trash2 className=" " />
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="message-input-container">
          <div className="message-input-wrapper">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
              disabled={deleteMode}
            />
            <Button
              type="submit"
              className="send-button"
              disabled={!newMessage.trim() || deleteMode}
            >
              <Send className="h-4 w-4" />
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
          <Button onClick={handleUnsendConfirm} autoFocus>
            Unsend
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Message;
