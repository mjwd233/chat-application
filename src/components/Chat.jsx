  import React, { useState , useEffect } 
  from "react";
  import Cam from "../img/cam.png";
  import Add from "../img/add.png";
  import More from "../img/more.png";
  import Delete from "../img/delete.jpg";
  import Messages from "./Messages";
  import Input from "./Input";
  import AddFriend from "./AddFriend";
  import {  useChat, useUser } from './UserContext';
  import {firestore} from '../firebaseconfig'
  import {  doc,collection,addDoc ,serverTimestamp   } from "firebase/firestore";


  const Chat = ({ onSearchChat, toggleBlackOverlay }) => {
    
    const { showAddFriend, setShowAddFriend } = useChat();

    const [inputValue, setInputValue] = useState('');
    const {friend , actuallmessagesId,mainuser ,message,setMessage,selectedUser} = useUser();

    
    const handleSearchS=(searchTerm) =>{
      onSearchChat(searchTerm)
    }


    const handleSend = async () => {    
    
      console.log("actualmessagesid:", actuallmessagesId);
      try {
        const conversationsref =collection(firestore, "conversations")
        const conversationId = actuallmessagesId;
        const conversationRef = doc(conversationsref, conversationId);
        console.log("conversationRef:", conversationRef);
        
        const messagesRef = collection(conversationRef, "messages");
        console.log("messagesRef:", messagesRef);
        await addDoc(messagesRef, {
          text: inputValue,
          sender: mainuser[0].userId, 
          createdAt: serverTimestamp(),
        }).catch((error) => {
          console.error("Error adding document: ", error);
        });
        setMessage([...message, { text: inputValue, sender: mainuser[0].userId, createdAt: serverTimestamp() }]) // what is this here ?
        setInputValue(''); // Clear the input field after sending the message
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    };



    const handleDeleteClick = () => {
    
      
      const usersToHighlight = friend.map((friendItem) => friendItem.id)
      toggleBlackOverlay(usersToHighlight);
      
    };
    

    return (
      <> 
        <div className="chat">
          <div className="chatInfo">
            <span>jane</span>
            <div className="chatIcons">
              <img src={Cam} alt="" />
              <img src={Add} alt="" onClick={() => setShowAddFriend(true)} />
              <img src={More} alt="" />
              <img src={Delete} alt="" onClick={handleDeleteClick}/>
            </div>
          </div>
          <Messages message={ message} friendObject = {selectedUser}   />
          <Input
          inputValue ={inputValue}
          setInputValue={setInputValue}
          onSend={handleSend}
          />
          {showAddFriend && <AddFriend onSearchAdd={handleSearchS} />}
      </div>
      </>  
    );
  };
export default Chat;