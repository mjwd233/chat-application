
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseconfig" 
import { useUser } from '../components/UserContext';
import { doc, setDoc ,getDoc} from "firebase/firestore";
import {firestore} from '../firebaseconfig'
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {

  const {  mainuser, seTheMainUser } = useUser();
console.log(mainuser);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
  
      ...formData,
      [name]: value,
    });

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      if (!mainuser.find(item => item.userId)) {
      seTheMainUser(mainuser =>[...mainuser, { userId: user.uid}]);
      }
      console.log("User signed in:", user);

      const userRef = doc(firestore, 'users', user.uid);
      getDoc(userRef).then((userDoc) =>{
        if(userDoc.exists()){
          const userData = userDoc.data();
          if (!mainuser.find(item => item.displayName)) {
       seTheMainUser(mainuser => [...mainuser, { displayName: userData.displayName, photo: userData.photoURL}]);
          }
        }
        else{
          console.log("no user info found ")
        }
      }).catch((error) => {
          console.error("Error getting user info:", error);
        });

    console.log(mainuser)
      navigate("/");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in:", errorCode, errorMessage);
    });
    
  };

return (
  <>
 
  
  <div className="formContainer">
    
 
      <div className="formWrapper">
  <h2>Login</h2>
  <span className="logo">Lama Chat</span>
        <span className="title">Login</span>
  <form onSubmit={handleSubmit}>
    <div>
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={email}
        onChange={handleChange} placeholder="email"      />
    </div>
    <div>
      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={handleChange} 
        placeholder="password"
      />
    </div>
    <button type="submit">Login</button>
  </form>
  <p>You don't have an account? </p>
</div>
</div>
</>

  );
};

export default Login;
              