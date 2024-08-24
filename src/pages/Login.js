import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from '../components/UserContext';

const Login = () => {
  const { mainuser, seTheMainUser } = useUser();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const user = response.data;
      console.log("User signed in:", user);

      // Update mainuser state
     /* seTheMainUser(mainuser => {
        const updatedUser = { userId: user._id, displayName: user.displayName, photo: user.photoURL };
        return mainuser.some(item => item.userId === user._id) ? mainuser : [...mainuser, updatedUser];
      });*/

      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error.response.data);
    }
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
              <span>Email:</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="email"
              />
            </div>
            <div>
              <span>Password:</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="password"
              />
            </div>
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/reset-password">Forgot Password?</Link>
            <button type="submit">Login</button>
          </form>
          <p>You don't have an account?</p>
        </div>
      </div>
    </>
  );
};

export default Login;