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
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [unsendDialogOpen, setUnsendDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      sender: user._id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await fetch(
        `http://localhost:3005/message/send/${user._id}`,
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

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await response.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...savedMessage, status: "sent" } : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
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
      // Optionally show error to user
    }

    setUnsendDialogOpen(false);
    setSelectedMessageId(null);
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

        {/* Messages Container */}
        <div className="messages-wrapper">
          {isLoading ? (
            <div className="loading">Loading messages...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            messages.map((message) => (
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
                    {message.status === "sent" &&
                      message.sender === user._id && (
                        <span className="message-status">Sent</span>
                      )}
                    {message.status === "failed" && (
                      <span className="message-status error">
                        Failed to send
                      </span>
                    )}
                  </div>
                </div>
                <div></div>

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
            ))
          )}
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
              fullWidth
            />
            <Button
              type="submit"
              className="send-button"
              disabled={!newMessage.trim() || deleteMode}
            >
              <Send className="icon" />
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
