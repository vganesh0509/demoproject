import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate, Link } from "react-router-dom";

function Navmenu({ isLoggedIn, logoutUser }) {
    const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    logoutUser();
    // navigate('/');
  }
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Big Data</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/workflow">Workflow</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to={'/login'} onClick={handleLogout}>Logout</Nav.Link> // Add a Logout link for logged-in users
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navmenu;