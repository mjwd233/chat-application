import React, { useState,useEffect,useRef } from 'react'
import {  useUser } from '../components/UserContext';
import {  doc,getDocs,collection,addDoc ,setDoc,serverTimestamp,onSnapshot, orderBy,deleteDoc,query, where ,getDoc  } from "firebase/firestore";
import {firestore} from '../firebaseconfig'

export const Chats = ({ highlightedUsers ,isBlackOverlay}) => {


 const {selectedUser,setSelectedUserfunc,friend,setFriendsInfo,setMessage, mainuser, rerender,setRender,setactuallmessageId} = useUser()
 const mainuserRef = useRef(mainuser);


 const clickedElementRef = useRef(null);



 
   //this funcitomn is done when clicking on the friend from the list to get his messages back
   const toShowmessagederivedfromConversationAndSend = async(userId)=>{
    //to store the conversation id 
    let conversationsId
  // taking a reference between the mainuser and the user  clicked to send message afterwards
    const conversationsRef = collection(firestore, "conversations");
    const q = query(conversationsRef, 
      where("users", "array-contains-any", [userId, mainuser[0].userId])
    );
    const snapshotConversations = await getDocs(q);
     snapshotConversations.docs.find((doc) => {
      const users = doc.data().users;
     if(users.includes(mainuser[0].userId) && users.includes(userId)) {
      conversationsId= doc.id
      setactuallmessageId(conversationsId) 
      return true
     }  
    return false
    });

 // referreing to the messages in this convid that we picked 
   const messagesRef = collection(firestore, "conversations" , conversationsId, "messages")

   const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));
   const messagesSnapshot = await getDocs(messagesQuery);
   const messages = messagesSnapshot.docs.map(  (doc) => 
     doc.data());
 
   // here is to get messages back after clicked on firend
   setMessage(messages)
 
    
    
   setSelectedUserfunc(friend.find((f) => f.id === userId));
   
   
    }


    const DeleteFriendfromdatabase = async (friendId) => {
      const userRef = doc(firestore, "users", mainuser[0].userId);
      const friendsRef = collection(userRef, "friends");
      const friendDocRef = doc(friendsRef, friendId);
    
      try {
        await deleteDoc(friendDocRef);
        console.log(`Friend with ID ${friendId} deleted successfully`);
        setRender(rerender+1)
      } catch (error) {
        console.error(`Error deleting friend: ${error}`);
      }
    };
    
  
    const TodisplayFriendsinChatsComponent = async (userId) => {
      const userRef = doc(firestore, "users", userId);
      const friendsRef = collection(userRef, "friends");
      const snapshot = await getDocs(friendsRef);
      const friendsData = snapshot.docs.map((doc) => {
        const friendId = doc.id;
      
          const friendData = doc.data();
        return {...friendData, id: friendId };
      });
      setFriendsInfo(friendsData); // here the link to dispaythem in chats component 
      return friendsData;
    };
   
    useEffect(() => {
      if (mainuserRef.current && mainuserRef.current[0] && mainuserRef.current[0].userId) {
      
         TodisplayFriendsinChatsComponent(mainuserRef.current[0].userId).then((friendsData) => {
      
    });
      }
    }, [rerender]);

  



  return (
   <>
        <div className='chats' > 
   
   {(friend) ? (
friend.map((chat) => (

 <div className={`userChat ${isBlackOverlay && highlightedUsers.includes(chat.id) ? 'highlight' : ''}`}
   key={chat.id}
   ref={(element) => clickedElementRef.current = element}
   onClick={(e) => {
     const element = e.target;
     
     if (element.classList.contains('highlight')) {
       DeleteFriendfromdatabase(chat.id);
     } else {
       setSelectedUserfunc({
         id: chat.id,
         friendName: chat.friendName,
         photo: chat.photo,
         // add any other properties you want to store in selectedUser
       });
       toShowmessagederivedfromConversationAndSend(chat.id);
     }
   }}>

       <div className="userChatInfo">
         <span>{chat.friendName} </span>
         <img src={chat.photo} alt="" />
       </div>

      


 </div>

))
) :null}
    </div>
    
         </>
 )
}
export default Chats;


/*import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../components/UserContext';

export const Chats = ({ highlightedUsers, isBlackOverlay }) => {
  const { selectedUser, setSelectedUserfunc, friend, setFriendsInfo, setMessage, mainuser, rerender, setRender, setactuallmessageId } = useUser();
  const mainuserRef = useRef(mainuser);
  const clickedElementRef = useRef(null);

  const toShowmessagederivedfromConversationAndSend = async (userId) => {
    try {
      const response = await fetch(`/api/conversations/${mainuser[0].userId}/${userId}`);
      const data = await response.json();
      setactuallmessageId(data.conversationId);
      setMessage(data.messages);
      setSelectedUserfunc(friend.find((f) => f.id === userId));
    } catch (error) {
      console.error(`Error fetching messages: ${error}`);
    }
  };

  const DeleteFriendfromdatabase = async (friendId) => {
    try {
      await fetch(`/api/friends/${mainuser[0].userId}/${friendId}`, { method: 'DELETE' });
      console.log(`Friend with ID ${friendId} deleted successfully`);
      setRender(rerender + 1);
    } catch (error) {
      console.error(`Error deleting friend: ${error}`);
    }
  };

  const TodisplayFriendsinChatsComponent = async (userId) => {
    try {
      const response = await fetch(`/api/friends/${userId}`);
      const friendsData = await response.json();
      setFriendsInfo(friendsData);
      return friendsData;
    } catch (error) {
      console.error(`Error fetching friends: ${error}`);
    }
  };

  useEffect(() => {
    if (mainuserRef.current && mainuserRef.current[0] && mainuserRef.current[0].userId) {
      TodisplayFriendsinChatsComponent(mainuserRef.current[0].userId);
    }
  }, [rerender]);

  return (
    <>
      <div className='chats'>
        {friend ? (
          friend.map((chat) => (
            <div
              className={`userChat ${isBlackOverlay && highlightedUsers.includes(chat.id) ? 'highlight' : ''}`}
              key={chat.id}
              ref={(element) => clickedElementRef.current = element}
              onClick={(e) => {
                const element = e.target;
                if (element.classList.contains('highlight')) {
                  DeleteFriendfromdatabase(chat.id);
                } else {
                  setSelectedUserfunc({
                    id: chat.id,
                    friendName: chat.friendName,
                    photo: chat.photo,
                  });
                  toShowmessagederivedfromConversationAndSend(chat.id);
                }
              }}
            >
              <div className="userChatInfo">
                <span>{chat.friendName} </span>
                <img src={chat.photo} alt="" />
              </div>
            </div>
          ))
        ) : null}
      </div>
    </>
  );
};

export default Chats;*/