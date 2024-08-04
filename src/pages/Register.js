import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseconfig";
import { firestore } from "../firebaseconfig";
import { doc, setDoc ,getDoc} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from '../components/UserContext';
import { uploadPhotoAndUpdateProfile } from "../storage";




const Register = () => {

  const defaultPhotoURL = '/images/newone.jpg';
  const { mainuser, seTheMainUser } = useUser();// id ,photo , dispalyname

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();
 
  const handleSignUp = async (e) => {
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password, {
        // Use popup mode instead of redirect
        mode: 'popup',
      });

      const downloadURL = await uploadPhotoAndUpdateProfile(defaultPhotoURL, "photos/newone.jpeg");

     
      onAuthStateChanged(auth, async (user) => {

   
        if (user) {
        
   
               
              /* if (!mainuser.find(item => item.userId)) {
             seTheMainUser(mainuser =>[...mainuser, {userId: mainuser.map(values => values.user.uid)}])
               }*/
      
          
           const uid = mainuser.map(values => values.user).uid;

       
         
          console.log('User created successfully!');
          

          
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            console.log('User document already exists!');
          } else {
            console.log('Creating new user document...');
          await setDoc(userRef, {
            displayName: displayName,
            email: email,
            password: password,
            createdAt: new Date(),
            photoURL: downloadURL,
          });
          if (!mainuser.find(item => item.displayName)) {
          seTheMainUser(mainuser =>[...mainuser, {displayName: displayName }]) 
          }
          if (!mainuser.find(item => item.defaultPhotoURL)) {
          seTheMainUser(mainuser =>[...mainuser, {photo: defaultPhotoURL }])
          }
        }
          navigate("/");
        } else {
          // User is signed out
        }
      });
     
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  };
 
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Register</span>
        <form>
          <input required type="text" placeholder="display name" value={displayName}
            onChange={(e) => setDisplayName(e.target.value)} />
          <input required type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" placeholder="password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <input required style={{ display: "none" }} type="file" id="file" />

      

            <img src="" alt="" />
            <span>Add an avatar</span>
    
          <button onClick={handleSignUp} >Sign up</button>
        </form>
        <p>
          You do have an account?
        </p>
      </div>
    </div>
  );
};
export default Register;