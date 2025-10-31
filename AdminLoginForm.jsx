import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (username.trim().length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      newErrors.password = 'Password must be at least 8 characters and include a number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Admin login:', { username, password });
      navigate('/admin/assignments'); // ✅ Redirect to admin assignment page
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Login</h2>
      <input type="text" placeholder="Admin Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      {errors.username && <p className="error">{errors.username}</p>}
      <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {errors.password && <p className="error">{errors.password}</p>}
      <label>
        <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
        Show Password
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

export default AdminLoginForm;
