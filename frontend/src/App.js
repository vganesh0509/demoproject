import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import WorkflowEditor from "./components/WorkflowEditor";
import Navmenu from './components/Navmenu';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

   // Function to handle user login (this can be set after a successful login)
   const setloginUser = () => setIsLoggedIn(true);

   // Function to handle user logout (this could be called on logout)
   const logoutUser = () => setIsLoggedIn(false);

  return (
    <Router>
      <div>
        <Navmenu isLoggedIn={isLoggedIn} logoutUser={logoutUser}/>

        <Routes>
          <Route path="/login" element={<Login setloginUser={setloginUser}/>} />
          <Route path="/register" element={<Register setloginUser={setloginUser}/>} />
          <Route path="/workflow" element={<WorkflowEditor />} />
          <Route path="/" element={<Login setloginUser={setloginUser}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
