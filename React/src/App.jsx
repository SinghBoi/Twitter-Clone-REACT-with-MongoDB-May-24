import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Login";
import SignUp from "./SignUp";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home/:id" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </Router>
  )
}