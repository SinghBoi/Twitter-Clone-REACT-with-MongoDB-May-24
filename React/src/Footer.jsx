import React from "react";

export default function Footer({ user, handleLogout }) {
  return (
    <div className="footer">
      {user && (
        <div className="footer-left">
          <img src={user.avatarUrl} alt={user.username} className="footer-avatar" />
          <div className="username-container">
            <span>{user.username}</span>
          </div>  
        </div>
      )}
      <div className="footer-right">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
