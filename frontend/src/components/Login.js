import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setloginUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin checkbox
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Email Validation (should end with @uncc.edu or @charlotte.edu)
    if (!email || !/(.*)@(uncc\.edu|charlotte\.edu)$/i.test(email)) {
      newErrors.email = "Please enter a valid university email (ending with @uncc.edu or @charlotte.edu).";
    }

    // Password Validation (should be at least 6 characters)
    if (!password || password.length < 6) {
      newErrors.password = "Password should be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return; // Don't proceed if validation fails
    }

    try {
      const response = await loginUser({ email, password, isAdmin }); // Include admin status in the request
      localStorage.setItem("role", response.data.role);  // Store role in localStorage
      setloginUser(  );
      navigate("/workflow");
    } catch (error) {
      console.log( error.response.data );
      console.log( error.message );
      alert("Login failed: " + error.response?.data?.error || error.message);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <Card className="shadow-sm p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={errors.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={errors.password}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Admin Checkbox */}
                <Form.Group controlId="formAdmin" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Are you an Instructor?"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)} // Update admin status
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
