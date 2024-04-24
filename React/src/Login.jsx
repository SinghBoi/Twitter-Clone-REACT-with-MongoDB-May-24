import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./Provider";
import "./Login.css";

const Login = () => {
  // const id = useParams().id
  const { login } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "", });
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = await login(formData)
    console.log(user)
    if (user) {
    navigate(`/home/${user.id}`)
    } else {
      setError("Invalid Email or Password")
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
      <div>
        <br /><br />
      { error }
      </div>
      <div className="button">
        <button onClick={() => navigate("/SignUp")}>Register New User</button>
      </div>
    </div>
  );
};

export default Login;
