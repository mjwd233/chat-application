import React, { useEffect, useState } from 'react';
import {  doc,getDocs,collection,addDoc ,setDoc,serverTimestamp,where,query,getDoc } from "firebase/firestore";
import {firestore} from '../firebaseconfig'
import { useUser } from '../components/UserContext';
import UserDeatilsCss from '../UserDetails.module.css';








const UserDetails = ({userId , onClose}) => {

  //constants
  const [user, setUser] = useState({})

  const [loading, setLoading] = useState(true);

  const {mainuser,rerender, setRender } = useUser();

    

    //funcitons
    //here i search for what ever conversation that has the main user after i check for specific user 
     const createConversation = async () => {
      try {
        const conversationsRef = collection(firestore, "conversations");
        const q = query(conversationsRef, 
          where("users", "array-contains", mainuser[0].userId)
        );
       
        const conversationsSnapshot = await getDocs(q);
    
        const existingConversation = conversationsSnapshot.docs.find((doc) => {
          const users = doc.data().users;
          return users.includes(mainuser[0].userId) && users.includes(userId);
        });
    
        if (!existingConversation) {
          // Create a new conversation
          const conversationRef = await addDoc(conversationsRef, {
            users: [mainuser[0].userId, userId],
            createdAt: serverTimestamp(),
          });
         
          const messagesRef = collection(conversationRef, "messages");
          await addDoc(messagesRef, {
            text: "lol",
            sender: mainuser[0].userId,
            createdAt: serverTimestamp(),
          }).catch((error) => {
            console.error("Error adding document: ", error);
          });
          console.log("Conversation created successfully");
        } else {
          console.log("Conversation already exists");
        }
      } catch (error) {
        console.error("Error creating conversation: ", error);
      }
    };
  

    
 
  

  
 

  const getUserByUserId = async (userId) => {

    const userRef = doc(firestore, "users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const users = userSnapshot.data();
      setUser(users)
    } else {
      console.error("User document not found");
    } 
  };

 

  useEffect(() => {
    const getUser = async () => {
        try{
     await getUserByUserId(userId);
    } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false); // Set loading state to false when done
      }
    };
    getUser();
  }, [userId]);



const addtofriendlist=async()=>{
  console.log(mainuser[0].userId)
  createConversation()
  const usersRef = doc(firestore, 'users', mainuser[0].userId);
  const friendId = userId;
  const friendDocRef = doc(collection(usersRef, "friends"), friendId);


  await setDoc(friendDocRef, {
    friendName: user.displayName,
    createdAt: new Date(),
    photo: user.photoURL,
  }).then(() => {
    console.log("Friend added successfully");
  setRender(rerender+1)
  }).catch((error) => {
    console.error(`Error adding friend: ${error}`);
  });
}

  if (loading) {
    return <div>Loading...</div>; // Return loading indicator
  }
  
  if (!user) {
    return <div>User not found</div>; // Return error message if user data is not available
  }

  return (
    <div className={UserDeatilsCss.userdetailscontainer}>
      <button onClick={onClose}>x</button>
      <img src={user.photoURL} alt="" className={UserDeatilsCss.userphoto} />
      <h2 className={UserDeatilsCss.username}>{user.displayName}</h2>
      <p className={UserDeatilsCss.useremail}>{user.email}</p>
      <button className={UserDeatilsCss.addfriendbutton} onClick={addtofriendlist}>add friend</button>
    </div>
  );
};

export default UserDetails;