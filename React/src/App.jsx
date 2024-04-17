import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Login";
import SignUp from "./SignUp";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login/:id" element={<Login />} />
      </Routes>
    </Router>
  )
}