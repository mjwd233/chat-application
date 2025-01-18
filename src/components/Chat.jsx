import React, { useState, useEffect } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Delete from "../img/delete.jpg";
import Messages from "./Messages";
import Input from "./Input";
import AddFriend from "./AddFriend";
import { useChat, useUser } from './UserContext';
import GroupChat from "./GroupChat";
import { createConversation } from '../pages/UserDetails';
import { Detector } from "react-detect-offline";


const Chat = ({ onSearchChat, toggleBlackOverlay, isGroupChat, setIsGroupChat }) => {
    const { showAddFriend, setShowAddFriend } = useChat();
    const [inputValue, setInputValue] = useState('');
    const { friend, actuallmessagesId, mainuser, message,socket, socketReady, setMessage, selectedUser, setActuallMessageId, groupId, rerender, setRerender } = useUser();
    const messageClasses = {
        message: 'message',
        messageInfo: 'messageInfo',
        messageContent: 'messageContent',
        wholecontainer: 'messages'
    };
    const [showDropdown, setShowDropdown] = useState(false);
    const [buttonLabel, setButtonLabel] = useState('');
    const [triggersend, setTriggersend] = useState(false);


    useEffect(() => {
        if (selectedUser && selectedUser[0]) {
            let status = selectedUser[0].status;
            const isDate = !isNaN(new Date(status));
            if(isDate){
                status = 'offline';
            }else{ 
                status = selectedUser[0].status;
            }
            console.log("Selected User Details:", {
                id: selectedUser[0].id,
                displayName: selectedUser[0].displayName,
                photo: selectedUser[0].photo,
                status: isDate ? 'offline' : status
            });
        }
    }, [selectedUser]);

    const storeUnsentMessage = (text, fileURL) => {
        const unsentMessages = JSON.parse(localStorage.getItem('unsentMessages') || '[]');
        const newMessage = {
            text,
            fileURL,
            conversationId: actuallmessagesId,
            sender: mainuser[0].userId,
            timestamp: new Date().toISOString(),
            pending: true
        };
        
        unsentMessages.push(newMessage);
        localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages));
        
        // Update UI with pending message
        setMessage(prev => [...prev, { ...newMessage, source: 'chat' }]);
        console.log('Message stored in localStorage and UI updated');
    };
    

    const sendStoredMessages = async () => {
        const unsentMessages = JSON.parse(localStorage.getItem('unsentMessages') || '[]');
        if (unsentMessages.length === 0) return;

        console.log('Sending stored messages...');

        setMessage(prev => prev.map(msg => 
            msg.pending ? { ...msg, pending: false } : msg
        ));
        
        for (const message of unsentMessages) {
            try {
                await sendMessage(message.text, message.fileURL);
                console.log('Stored message sent successfully');
            } catch (error) {
                console.error('Failed to send stored message:', error);
                return;
            }
        }

        localStorage.removeItem('unsentMessages');
        console.log('All stored messages sent');
    };
   

    useEffect(() => {
        console.log('isGroupChat changed:', isGroupChat);
    }, [isGroupChat]);

    const handleSearchS = (searchTerm) => {
        onSearchChat(searchTerm);
    };


    const handleSendWithConnectionCheck = (online, text, fileURL) => {
        if (!online) {
            console.log('Cannot send message - offline');
            storeUnsentMessage(text, fileURL);
            return;
        }
        triggeeringsendingMessage(text, fileURL);
    };

    const triggeeringsendingMessage = (text, fileURL) => {

        
        setTriggersend(!triggersend);
        sendMessage(text, fileURL);
        
    };

    const sendMessage = async (text, fileURL) => {
        if (!actuallmessagesId || !text.trim()) return;

        let messageStatus = 'sent'; // Default status
    
    if (selectedUser && selectedUser[0]) {
        const status = selectedUser[0].status;
        
        // Check if status is a date (offline timestamp) or offline status
        const isDate = !isNaN(new Date(status));
        if (isDate || status === 'offline') {
            messageStatus = 'sent'; // User is offline
        } else if (status === 'online') {
            messageStatus = 'delivered'; // User is online
        } else if (['away', 'busy', 'doNotDisturb'].includes(status)) {
            messageStatus = 'delivered'; // User is online but in different states
        }
    }
    
        const newMessage = {
            conversationId: actuallmessagesId,
            text: text || null,
            fileURL: fileURL || null,
            sender: mainuser[0].userId,
            timestamp: new Date().toISOString(),
            status: messageStatus
        };
    
        // Add to UI immediately with pending status
        setMessage(prev => [...prev, { ...newMessage, source: 'chat' }]);
    
        // Emit through socket
        socket.emit('sendMessage', {
            ...newMessage,
            receiverId: selectedUser[0].id
        });
    };

    useEffect(() => {
        if (!socketReady || !socket) return;
    
     
   
    }, [socket, socketReady]);

    useEffect(() => {
        console.log("creating conversation ...")
        const createConversationIfNeeded = async () => {
            if (actuallmessagesId === null) {
                try {
                    const newConversation = await createConversation(mainuser, selectedUser[0].id);
                    
                    if (newConversation && newConversation.conversation) {
                        setActuallMessageId(newConversation.conversation._id);
                    } else {
                        console.error("Failed to create a new conversation.");
                    }
                } catch (error) {
                    console.error("Error creating conversation:", error.message);
                }
            }
        };
        selectedUser.length > 0 ? createConversationIfNeeded() : null;
    }, [actuallmessagesId, triggersend]);



    const highlightFriendsForDeletion = () => {
        const usersToHighlight = friend.map((friendItem) => friendItem.friendId);
        toggleBlackOverlay(usersToHighlight);
    };

    const toggleGroupOptionsDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const updateGroupActionLabel = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/auth/groups/state/${mainuser[0].userId}/${groupId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setButtonLabel("delete group")
            }
            if (!response.ok) {
                setButtonLabel("leave group")
            }
        } catch (error) {
            console.error('Error checking user state :', error);
        }
    };

    useEffect(() => {
        if (showDropdown) {
            updateGroupActionLabel();
        }
    }, [showDropdown]);

    const handleGroupDeletionOrExit = async () => {
        if (buttonLabel === "delete group") {
            try {
                const response = await fetch(`http://localhost:5000/api/auth/groups/${groupId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log('Group deleted successfully');
                    setRerender((prev) => prev + 1);
                } else {
                    console.error('Failed to delete group');
                }
            } catch (error) {
                console.error('Error deleting group:', error);
            }
        } else {
            try {
                console.log('User ID:', mainuser[0].userId);
                console.log('Group ID:', groupId);
                const response = await fetch(`http://localhost:5000/api/auth/groups/userRemovel/${mainuser[0].userId}/${groupId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    console.log('user was removed');
                    setRerender((prev) => prev + 1);
                } else {
                    console.error('user wasnt removed successfully');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };


     
    return (
        <>
            <div className="chat">
                <Detector
                    render={({ online }) => {
                        if (online) {
                            sendStoredMessages();
                        }
                        return (
                            <>
                                <div className="chatInfo">
                                    <div className="chatIcons">
                                        <img src={Cam} alt="" />
                                        <img src={Add} alt="" onClick={() => { setShowAddFriend(true); setIsGroupChat(false); }} />
                                        <div className="more-icon-wrapper">
                                            <img src={More} alt="" onClick={toggleGroupOptionsDropdown} />
                                            {showDropdown && (
                                                <div className="dropdown-menu">
                                                    <button onClick={handleGroupDeletionOrExit}>{buttonLabel}</button>
                                                </div>
                                            )}
                                        </div>
                                        <img src={Delete} alt="" onClick={highlightFriendsForDeletion} />
                                    </div>
                                </div>
                                {isGroupChat ? (
                                    <GroupChat setIsGroupChat={setIsGroupChat} />
                                ) : (
                                    <>
                                        <Messages 
                                            message={message} 
                                            friendObject={selectedUser} 
                                            messageClasses={messageClasses} 
                                            componentType={"chat"} 
                                        />
                                        <Input
                                            inputValue={inputValue}
                                            setInputValue={setInputValue}
                                            onSend={(text, fileURL) => handleSendWithConnectionCheck(online, text, fileURL)}
                                        />
                                        {showAddFriend && <AddFriend onSearchAdd={handleSearchS} />}
                                    </>
                                )}
                                <div style={{
                                    position: 'fixed',
                                    bottom: '20px',
                                    right: '20px',
                                    padding: '10px',
                                    backgroundColor: online ? '#4CAF50' : '#f44336',
                                    color: 'white',
                                    borderRadius: '4px'
                                }}>
                                    {online ? '🟢 Connected' : '🔴 Disconnected'}
                                </div>
                            </>
                        );
                    }}
                />
            </div>
        </>
    );
};

export default Chat;