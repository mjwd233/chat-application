import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from '../ResetPassword.module.css'; // Import the CSS module

const Resetpassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { token, newPassword });
      setMessage('Password has been reset.');
    } catch (error) {
      setMessage('Error resetting password.');
    }
  };

  return (
    <div className={styles.resetPasswordContainer}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Resetpassword;