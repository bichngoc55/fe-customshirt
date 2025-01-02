import React, { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, CircularProgress } from "@mui/material";
import './Message.css';
import { useSelector } from 'react-redux';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';

const Message = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

    const { user } = useSelector((state) => state.auths);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const [state, setState] = useState({
        selectedUser: null,
        newMessage: '',
        messages: [],
        users: [],
        dialogOpen: false,
        selectedMessageId: null,
        isLoading: false,
        imageFile: null,
        imagePreview: null,
        isLoadingMessages: false,
        showChat: false,
        menuOpenId: null
    });

    // const fetchUsers = async () => {
    //     try {
    //         const response = await axios.get("http://localhost:3005/user/");
    //         setState(prev => ({ ...prev, users: response.data.users }));
    //     } catch (error) {
    //         console.error("Error fetching users:", error);
    //     }
    // };
    const fetchUsers = async () => {
      try {
          const response = await axios.get("http://localhost:3005/user/");
          const users = response.data.users;
          setState(prev => ({ ...prev, users }));
          
          if (users.length > 0 && !userId) {
              navigate(`/message/${users[0]._id}`);
          }
        
          if (userId) {
              const selectedUser = users.find(u => u._id === userId);
              if (selectedUser) {
                  setState(prev => ({ ...prev, selectedUser }));
              }
          }
      } catch (error) {
          console.error("Error fetching users:", error);
      }
  };

    const fetchMessages = async () => {
        if (!state.selectedUser) return;
        
        setState(prev => ({ ...prev, isLoadingMessages: true }));
        try {
            const response = await axios.get(`http://localhost:3005/message/conversation/${state.selectedUser._id}`);
            setState(prev => ({ 
                ...prev, 
                messages: response.data,
                isLoadingMessages: false 
            }));
        } catch (error) {
            console.error("Error loading messages:", error);
            setState(prev => ({ ...prev, isLoadingMessages: false }));
        }
    };

    // useEffect(() => {
    //     fetchUsers();
    // }, []);

    useEffect(() => {
        if (state.selectedUser) {
            fetchMessages();
        }
    }, [state.selectedUser]);
    useEffect(() => {
      if (userId && state.users.length > 0) {
          const selectedUser = state.users.find(u => u._id === userId);
          if (selectedUser) {
              setState(prev => ({ ...prev, selectedUser }));
          }
      }
  }, [userId, state.users]);

  useEffect(() => {
      fetchUsers();
  }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.messages]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setState(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const clearImageUpload = () => {
        setState(prev => ({
            ...prev,
            imageFile: null,
            imagePreview: null
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSendMessageAdmin = async (e) => {
        e.preventDefault();
        if (!state.newMessage.trim() && !state.imageFile) return;

        const tempId = Date.now().toString();
        setState(prev => ({ ...prev, isLoading: true }));
        
        let imageUrl = null;

        if (state.imageFile) {
            const formData = new FormData();
            formData.append("file", state.imageFile);
            formData.append("upload_preset", "domdom");
            formData.append("cloud_name", "dejoc5koc");
            try {
                const uploadResponse = await axios.post(
                    `https://api.cloudinary.com/v1_1/dejoc5koc/image/upload`,
                    formData
                );
                imageUrl = uploadResponse.data.secure_url;
            } catch (error) {
                console.error("Error uploading image:", error);
                setState(prev => ({ ...prev, isLoading: false }));
                return;
            }
        }

        const tempMessage = {
            _id: tempId,
            sender: '6716e91039ea3d3dc8d3f65f',
            receiver: state.selectedUser._id,
            content: state.newMessage,
            image: imageUrl,
            createdAt: new Date().toISOString(),
            status: 'sending'
        };

        setState(prev => ({
            ...prev,
            messages: [...prev.messages, tempMessage],
            newMessage: '',
            isLoading: false
        }));
        clearImageUpload();

        try {
            const response = await axios.post(`http://localhost:3005/message/admin/send`, {
                receiverId: state.selectedUser._id,
                content: state.newMessage,
                image: imageUrl
            });

            setState(prev => ({
                ...prev,
                messages: prev.messages.map(msg =>
                    msg._id === tempId ? { ...response.data, status: 'sent' } : msg
                )
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                messages: prev.messages.map(msg =>
                    msg._id === tempId ? { ...msg, status: 'failed' } : msg
                )
            }));
        }
    };

    const handleUnsendMessage = async () => {
        try {
            await axios.put(`http://localhost:3005/message/unsend/${state.selectedMessageId}`);
            setState(prev => ({
                ...prev,
                messages: prev.messages.map(msg =>
                    msg._id === state.selectedMessageId
                        ? { ...msg, content: 'This message was unsent', isUnsent: true }
                        : msg
                ),
                dialogOpen: false,
                selectedMessageId: null
            }));
        } catch (error) {
            console.error("Error unsending message:", error);
        }
    };

    return (
        <div className="message-page">
            <div style={{ display: "flex", flexDirection: "row", gap: "24px", margin: "0 auto", maxWidth: "1200px" }}>
                <div className="customer-list-container">
                    <h2 className="customer-list-title">Conversations</h2>
                    <ul className="customer-list">
                        {state.users.map((u) => (
                            <li
                                key={u._id}
                                onClick={() => {setState(prev => ({ ...prev, selectedUser: u })) ; navigate(`/admin/message/${u._id}`)}}
 
                                className={`customer-item ${state.selectedUser?._id === u._id ? 'selected' : ''}`}
                            >
                                <div className="customer-avatar">
                                    <Avatar src={u?.avaURL} alt="" />
                                </div>
                                <div className="customer-info">
                                    <p className="customer-name">{u.username}</p>
                                    <p className="customer-role">{u.email}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="messages-container">
                    {!state.selectedUser ? (
                        <div className="no-chat-selected">
                            Select a conversation to start messaging
                        </div>
                    ) : state.isLoadingMessages ? (
                        <div className="loading-messages">
                            <CircularProgress />
                            <p>Loading messages...</p>
                        </div>
                    ) : state.messages.length === 0 && !state.showChat ? (
                        <div
                            className="no-messages"
                            onClick={() => setState(prev => ({ ...prev, showChat: true }))}
                            style={{ cursor: 'pointer' }}
                        >
                            <p>No messages in this conversation yet.</p>
                            <p
                                style={{
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
                                }}
                            >
                                Start a conversation by sending a message!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="message-header">
                                <div className="header-content">
                                    <div className="customer-avatar">
                                        <Avatar src={state.selectedUser?.avaURL} alt="" />
                                    </div>
                                    <div className="header-info">
                                        <h2 className="header-name">{state.selectedUser.username}</h2>
                                        <p className="header-role">{state.selectedUser.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="messages-area">
                                {state.messages.map((message) => {
                                    const isCustomer = message.sender === user._id;
                                    return (
                                        <div key={message._id} className={`message-wrapper ${isCustomer ? 'sender' : 'receiver'}`}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                {isCustomer && !message.isUnsent && (
                                                    <div style={{ position: 'relative' }}>
                                                        <button
                                                            onClick={() => setState(prev => ({
                                                                ...prev,
                                                                menuOpenId: prev.menuOpenId === message._id ? null : message._id
                                                            }))}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                fontSize: '1rem',
                                                                marginRight: '5px',
                                                                marginTop: '10px',
                                                            }}
                                                        >
                                                            ⋮
                                                        </button>
                                                        {state.menuOpenId === message._id && (
                                                            <div
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '20px',
                                                                    left: '0',
                                                                    background: '#333',
                                                                    color: 'white',
                                                                    borderRadius: '4px',
                                                                    padding: '8px',
                                                                    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
                                                                    zIndex: 10,
                                                                }}
                                                            >
                                                                <button
                                                                    onClick={() => {
                                                                        setState(prev => ({
                                                                            ...prev,
                                                                            selectedMessageId: message._id,
                                                                            dialogOpen: true,
                                                                            menuOpenId: null
                                                                        }));
                                                                    }}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: 'white',
                                                                        cursor: 'pointer',
                                                                        padding: '4px',
                                                                        textAlign: 'left',
                                                                        width: '100%',
                                                                        fontFamily: "Montserrat",
                                                                        fontSize: '0.85rem',
                                                                    }}
                                                                >
                                                                    Unsend
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className={`message-bubble ${isCustomer ? 'customer-message' : 'admin-message'}`}>
                                                    {message.image && !message.isUnsent && (
                                                        <img
                                                            src={message.image}
                                                            alt="Uploaded"
                                                            style={{
                                                                maxWidth: '100%',
                                                                borderRadius: '4px',
                                                                marginBottom: '8px',
                                                            }}
                                                        />
                                                    )}
                                                    <p 
                                                      className="message-text"
                                                      style={message.isUnsent ? { fontStyle: 'italic', color: 'rgb(54, 54, 54)' } : {}}
                                                    >
                                                      {message.isUnsent ? 'This message was unsent' : message.content}
                                                    </p>
                                                    <div className="message-info">
                                                        <span className="message-timestamp">
                                                            {new Date(message.createdAt).toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })}
                                                        </span>
                                                        {message.status === 'sending' && (
                                                            <span style={{ marginLeft: '8px', fontSize: '0.75rem' }}>Sending...</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {state.imagePreview && (
                                <div className="image-preview">
                                    <img src={state.imagePreview} alt="Preview" />
                                    <Button onClick={clearImageUpload}>Remove</Button>
                                </div>
                            )}

                            <form onSubmit={handleSendMessageAdmin} className="message-input-form">
                                <div className="input-container">
                                    <input
                                        type="text"
                                        value={state.newMessage}
                                        onChange={(e) => setState(prev => ({ ...prev, newMessage: e.target.value }))}
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
                                        disabled={(!state.newMessage.trim() && !state.imageFile) || state.isLoading}
                                        className="send-button"
                                    >
                                        {state.isLoading ? (
                                            <CircularProgress size={24} className="send-spinner" />
                                        ) : (
                                            <Send className="send-icon" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <Dialog open={state.dialogOpen} onClose={() => setState(prev => ({ ...prev, dialogOpen: false }))}>
                <DialogTitle>Unsend Message</DialogTitle>
                <DialogContent>
                    Are you sure you want to unsend this message?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setState(prev => ({ ...prev, dialogOpen: false }))}>Cancel</Button>
                    <Button onClick={handleUnsendMessage} color="primary">
                        Unsend
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Message;