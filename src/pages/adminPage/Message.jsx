import React, { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  CircularProgress
} from "@mui/material";
import './Message.css';
import { useSelector } from 'react-redux';

const Message = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const {user}= useSelector((state)=> state.auths) 
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3005/user/");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  // const fetchMessages = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3005/message/conversation/${selectedUser._id}`);
  //     setMessages(response.data);
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //   }
  // };
  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    } else {
      setMessages([]); 
    }
  }, [selectedUser]);
  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const response = await axios.get(`http://localhost:3005/message/conversation/${selectedUser._id}`);
      setMessages(response.data);
      console.log("dtata", response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
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

  
  const handleSendMessageAdmin = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;
  
    const tempId = Date.now().toString();
    setIsLoading(true);
  
    let imageUrl = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "domdom");
      formData.append("cloud_name", "dejoc5koc");
  
      try {
        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/dejoc5koc/image/upload`,
          formData
        );
        imageUrl = uploadResponse.data.secure_url;
      } catch (error) {
        console.error("Image upload error:", error);
        setIsLoading(false);
        return;
      }
    }
  
    const tempMessage = {
      _id: tempId,
      sender: '6716e91039ea3d3dc8d3f65f', // Admin ID
      receiver: selectedUser._id,
      content: newMessage,
      image: imageUrl,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };
  
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    clearImageUpload();
  
    try {
      const response = await axios.post(`http://localhost:3005/message/admin/send`, {
        receiverId: selectedUser._id,
        content: newMessage,
        image: imageUrl
      });
  
      setMessages(prev => 
        prev.map(msg => 
          msg._id === tempId ? { ...response.data, status: 'sent' } : msg
        )
      );
    } catch (error) {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === tempId ? { ...msg, status: 'failed' } : msg
        )
      );
    }
    setIsLoading(false);
  };
  const handleUnsendMessage = async () => {
    try {
      await axios.put(`http://localhost:3005/message/unsend/${selectedMessageId}`);
      setMessages(prev =>
        prev.map(msg =>
          msg._id === selectedMessageId
            ? { ...msg, content: 'This message was unsent', isUnsent: true }
            : msg
        )
      );
    } catch (error) {
      console.error("Error unsending message:", error);
    }
    setDialogOpen(false);
    setSelectedMessageId(null);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (messages.length > 0) {
      console.log("Messages with sender:", messages.map(message => ({
        id: message._id,
        sender: message.sender,
        content: message.content
      })));
    }
  }, [messages]);

  const handleStartConversation = () => {
    setShowChat(true);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const MessageBubble = ({ message, isCustomer }) => (
    <div className={`message-wrapper ${isCustomer ? 'sender' : 'reciver'}`}>
      <div 
        className={`message-bubble ${isCustomer ? 'customer-message' : 'admin-message'}`}
        style={{
          alignSelf: isCustomer ? 'flex-start' : 'flex-end',
          backgroundColor: isCustomer ? '#1e2736' : '#2563eb',
          color: 'white',
          maxWidth: '70%',
          padding: '12px',
          borderRadius: '8px',
          margin: '4px 5px'
        }}
      >
        {message.image && !message.isUnsent && (
          <img 
            src={message.image} 
            alt="Uploaded" 
            style={{
              maxWidth: '100%',
              borderRadius: '4px',
              marginBottom: '8px'
            }}
          />
        )}
        <p className="message-text">
          {message.isUnsent ? 'This message was unsent' : message.content}
        </p>
        <div className="message-info">
          <span className="message-timestamp">
            {new Date(message.createdAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </span>
          {message.status === 'sending' && (
            <span style={{ marginLeft: '8px', fontSize: '0.75rem' }}>Sending...</span>
          )}
        </div>
        {!isCustomer && !message.isUnsent && (
          <button
            onClick={() => {
              setSelectedMessageId(message._id);
              setDialogOpen(true);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '4px',
              marginTop: '4px'
            }}
          >
            Unsend
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="message-page">
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "24px",
        margin: "0 auto",
        maxWidth: "1200px"
      }}>
        <div className="customer-list-container">
          <h2 className="customer-list-title">Conversations</h2>
          <ul className="customer-list">
            {users.map(user => (
              <li
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`customer-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
              >
                <div className="customer-avatar">
                  <Avatar src={user?.avaURL} alt="" />
                </div>
                <div className="customer-info">
                  <p className="customer-name">{user.username}</p>
                  <p className="customer-role">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="messages-container">
          {!selectedUser ? (
            <div className="no-chat-selected">
              Select a conversation to start messaging
            </div>
          ) : isLoadingMessages ? (
            <div className="loading-messages">
              <CircularProgress />
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 && !showChat ? (
            <div className="no-messages" onClick={handleStartConversation} style={{ cursor: 'pointer' }}>
              <p>No messages in this conversation yet.</p>
              <p style={{
                color: '#a8dfd8',
                fontWeight: 'bold',
                padding: '10px 20px',
                border: '2px solid #a8dfd8',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '10px',
                display: 'inline-block',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                ':hover': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  transform: 'scale(1.05)'
                }
              }}>
                Start the conversation by sending a message!
                </p>
            </div>
          ) : (
            <>
              <div className="message-header">
                <div className="header-content">
                  <div className="customer-avatar">
                    <Avatar src={selectedUser?.avaURL} alt="" />
                  </div>
                  <div className="header-info">
                    <h2 className="header-name">{selectedUser.username}</h2>
                    <p className="header-role">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              {/* <div className="messages-area">
                {messages.map(message => (
                  <div
                    key={message._id}
                    className={`message-bubble ${
                      message.sender == user._id ? 'customer-message' : 'admin-message'
                    } ${message.status === 'unsent' || message.isUnsent ? 'unsent-message' : ''}`}
                  >
                    <div className="message-content">
                      {!(message.status === 'unsent' || message.isUnsent) && message.image && (
                        <img src={message.image} alt="Uploaded" className="uploaded-image" />
                      )}
                      <p>{message.isUnsent ? 'This message was unsent' : message.content}</p>
                      <div className="message-info">
                        <span className="message-timestamp">{formatTimestamp(message.createdAt)}</span>
                        {message.status === 'sending' && (
                          <span className="message-status">Sending...</span>
                        )}
                        {message.status === 'sent' && message.sender === selectedUser._id && (
                          <span className="message-status">Sent</span>
                        )}
                        {message.status === 'failed' && (
                          <span className="message-status error">Failed to send</span>
                        )}
                      </div>
                    </div>

                    {message.sender === selectedUser._id && !message.isUnsent && 
                     message.status !== 'unsent' && (
                      <button
                        className="unsend-button"
                        onClick={() => {
                          setSelectedMessageId(message._id);
                          setDialogOpen(true);
                        }}
                      >
                        Unsend
                      </button>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div> */}

<div className="messages-area">
                {messages.map(message => (
                  <MessageBubble 
                    key={message._id}
                    message={message}
                    isCustomer={message.sender === user._id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              {/* <form className="message-input-form">
                <div className="input-container">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <Button
                    onClick={() => fileInputRef.current.click()}
                    className="image-upload-button"
                  >
                    <ImageIcon />
                  </Button>
                  <button
                    type="submit"
                    disabled={(!newMessage.trim() && !imageFile) || isLoading}
                    className="send-button"
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Send />
                    )}
                  </button>
                </div>
              </form> */}

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <Button onClick={clearImageUpload}>Remove</Button>
                </div>
              )}

              <form onSubmit={handleSendMessageAdmin} className="message-input-form">
                <div className="input-container">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <Button
                    onClick={() => fileInputRef.current.click()}
                    className="image-upload-button"
                  >
                    <ImageIcon className="icon" />
                  </Button>
                  <button
                    type="submit"
                    disabled={(!newMessage.trim() && !imageFile) || isLoading}
                    className="send-button"
                  >
                    {isLoading ? (
                      <CircularProgress size={24} className="send-spinner" />
                    ) : (
                      <Send className="send-icon" />
                    )}
                  </button>
                </div>
              </form>
            </>
          // )
          // ) : (
          //   <div className="no-chat-selected">
          //     Select a conversation to start messaging
          //   </div>
          )}
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Unsend Message</DialogTitle>
        <DialogContent>
          Are you sure you want to unsend this message?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUnsendMessage} color="primary">
            Unsend
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Message;