import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./Provider";
import "./SignUp.css";

export default function SignUp () {
  const { signup } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    verifyPassword: "",
    username: "",
    about: "",
    employment: "",
    hometown: "",
    website: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const newUser = await signup(formData);
    if (!newUser) {
      alert("Email Invalid / Already Exists & Password must be at least 8 characters," +
            "containing one numeric and one special character");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email}  onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
          required />
        <input type="password" name="verifyPassword" placeholder="Verify Password" value={formData.verifyPassword}
          onChange={handleChange} required />
        <input type="text" name="username" placeholder="Nickname" value={formData.username} onChange={handleChange} />
        <textarea name="about" placeholder="About" value={formData.about} onChange={handleChange} />
        <input type="text" name="employment" placeholder="Employment" value={formData.occupation} onChange={handleChange} />
        <input type="text" name="hometown" placeholder="Hometown" value={formData.hometown} onChange={handleChange} />
        <input type="url" name="website" placeholder="Website" value={formData.website} onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
