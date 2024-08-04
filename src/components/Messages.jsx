import React from 'react'
import Message from "./Message"


const Messages = ({message ,friendObject}) => {



  




  return (
    <div className="messages" >
        <Message message={message} friendObject={friendObject} /> 
       
        
    </div>
  )
}

export default Messages
