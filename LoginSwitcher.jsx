import React, { useState } from 'react';
import StudentLoginForm from './StudentLoginForm';
import AdminLoginForm from './AdminLoginForm';
import AdminAssignmentForm from './AdminAssignmentForm';
import StudentAssignmentForm from './StudentAssignmentForm';
import './Login.css';

const STUDENT = 'student';
const ADMIN = 'admin';

function LoginSwitcher() {
  const [activeRole, setActiveRole] = useState(STUDENT);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  const handleLoginSuccess = (id) => {
    setUserId(id); // Save student/admin ID
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
  };

  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="brand">
          <img
            src="pvp.png"
            className="rounded-circle"
            style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }}
            alt="Logo"
          />
          <div className="logo">EduAssign</div>
        </div>
        <div className="nav-buttons">
          <button className="nav-btn">Home</button>
          <button
            className={`nav-btn ${activeRole === STUDENT ? 'active' : ''}`}
            onClick={() => {
              setActiveRole(STUDENT);
              handleLogout();
            }}
          >
            Student
          </button>
          <button
            className={`nav-btn ${activeRole === ADMIN ? 'active' : ''}`}
            onClick={() => {
              setActiveRole(ADMIN);
              handleLogout();
            }}
          >
            Admin
          </button>
          {isLoggedIn && (
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <div className="content-split">
        <div className="left-side"></div>
        <div className="right-side">
          <div className="form-wrapper">
            {!isLoggedIn ? (
              activeRole === STUDENT ? (
                <StudentLoginForm onLoginSuccess={handleLoginSuccess} />
              ) : (
                <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
              )
            ) : (
              activeRole === STUDENT ? (
                <StudentAssignmentForm studentId={userId} />
              ) : (
                <AdminAssignmentForm adminId={userId} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSwitcher;
