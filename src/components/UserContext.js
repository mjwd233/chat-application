import React, { createContext, useContext, useState,useEffect } from 'react';

const UserContext = createContext();
const ChatContext = createContext();


export const UserProvider = ({ children }) => {

  const [mainuser, setMainUser] = useState(() => {
    const storedMainUser = localStorage.getItem('mainuser');
    if (storedMainUser) {
      try {
        return JSON.parse(storedMainUser);
      } catch (error) {
        console.error(error);
        return [];
      }
    } else {
      return [];
    }
  });

  
  useEffect(() => {
    localStorage.setItem('mainuser', JSON.stringify(mainuser));
  }, [mainuser]);

  const [friend, setFriends] = useState([]);

const [selectedUser , setSelectedUser] = useState()

  const [message, setmessage] = useState([]);


const  [rerender, setRerender] = useState('')

  const [showAddFriend, setShowAddFriend] = useState(false);

  const [actuallmessagesId ,SetmessageactuallId] = useState();


  const setSelectedUserfunc =  (value) =>{
      setSelectedUser(value)
  }


  const setactuallmessageId =(value) =>{
    SetmessageactuallId(value)
  }

  const setRender=(value) => {
    setRerender(value)
  }



const setMessage= (message) =>{
  setmessage(message)
}
  


  const setFriendsInfo =(newResult) =>{
    setFriends(newResult)
  }

  const seTheMainUser = (mainuserinfo) => {
    setMainUser(mainuserinfo);
    localStorage.setItem('mainuser', JSON.stringify(mainuserinfo));
  };

  
  const setShowAddFriends = (value) =>{
    setShowAddFriend(value)
  }





  const userValue = {
    selectedUser,
    setSelectedUserfunc,
    rerender, setRender,
    actuallmessagesId, 
    setactuallmessageId,
    message,
    setMessage,
    mainuser,
    seTheMainUser,
    friend,
    setFriendsInfo,
  };
 
  const chatValue = {
    showAddFriend,
    setShowAddFriend,
  };




  return (
    <UserContext.Provider value={ userValue}>
       <ChatContext.Provider value={chatValue}>
       
      {children}
    
      </ChatContext.Provider>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
export const useChat = () => {
  return useContext(ChatContext);
};

