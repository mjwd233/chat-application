import React , { useEffect }from 'react';
import { useUser } from '../components/UserContext';

const Message = ({message ,friendObject}) => {

  const { mainuser  } = useUser();

 


  return (
<>
{message.map((msg, index) => ( 
                <div key={index}>
           
   <div         
   className={`message ${msg.sender === mainuser[0].userId? 'owner' : 'notowner'}`}
   >
        <div className="messageInfo">
        {(friendObject!==null&&friendObject!==undefined&&mainuser!==null) && (
                <img
                  src={msg.sender === friendObject.id ? friendObject.photo : mainuser[1].photo}
                  alt=""
                />
              )}
            {(friendObject!==null&&friendObject!==undefined&&mainuser!==null)   && (
                <p> 
                  {msg.sender === friendObject.id ? friendObject.friendName : mainuser[1].displayName}
                </p>
              )}
        </div>

        <div className="messageContent">
        <p>{msg.text}</p> 
        </div>

        </div>

    </div>
 
))}
    </>
  )
}

export default Message
