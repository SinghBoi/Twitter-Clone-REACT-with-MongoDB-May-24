import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./Provider";
import "./Login.css";

export default function Login () {
  const { login } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value, }));
  };

  // In your Login component, handle the login process and store the authentication token upon successful login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData); // Assuming login function is implemented
      if (user) {
        const userId = sessionStorage.getItem("userId");
        navigate(`/home/${userId}`);
      } else {
        alert("Invalid Email or Password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
          required />
        <button type="submit">Login</button>
      </form>
      <br />
      <br />
      <div className="button">
        <button onClick={() => navigate("/SignUp")}>Register New User</button>
      </div>
    </div>
  );
};
