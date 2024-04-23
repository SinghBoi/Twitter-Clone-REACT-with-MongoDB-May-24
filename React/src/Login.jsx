import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "./Provider";
import "./Login.css";

const Login = () => {
  const id = useParams().id
  const { getAll, getOne } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "", });

  useEffect(() => {
        async function main() {
            const user = await getAll();
            setFormData(user);
        }
        main();
    }, []);

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
    await getOne(id)
    navigate("/home/:id")
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
