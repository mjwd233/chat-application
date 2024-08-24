import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from '../components/UserContext';

const Register = () => {
  const defaultPhotoURL = '/images/newone.jpg';
  const { mainuser, seTheMainUser } = useUser(); // id, photo, displayName

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        displayName,
        email,
        password,
        photoURL: defaultPhotoURL,
      });

      console.log('User created successfully!', response.data);

      seTheMainUser([...mainuser, {
        id: response.data.user.id, // Use the id from the response
        displayName: response.data.user.displayName,
        photo: response.data.user.photoURL,
      }]);
  

      navigate("/");
    } catch (error) {
      console.error('Error creating user:', error.response.data);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Register</span>
        <form>
          <span>Display Name</span>
          <input
            required
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <span>Email</span>
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Password</span>
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input required style={{ display: "none" }} type="file" id="file" />
          <img src="" alt="" />
          <span>Add an avatar</span>
          <button onClick={handleSignUp}>Sign up</button>
        </form>
        <p>You do have an account?</p>
      </div>
    </div>
  );
};

export default Register;