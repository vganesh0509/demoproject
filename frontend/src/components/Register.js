import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Register = ({ setloginUser }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin checkbox
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // First Name Validation
    if (!firstName || firstName.length < 2) {
      newErrors.firstName = "First Name should be at least 2 characters long.";
    }

    // Last Name Validation
    if (!lastName || lastName.length < 2) {
      newErrors.lastName = "Last Name should be at least 2 characters long.";
    }

    // Student ID Validation (exactly 9 digits)
    if ( !isAdmin && (!studentId || !/^\d{9}$/.test(studentId) )) {
      newErrors.studentId = "Student ID must be exactly 9 digits.";
    }

    // Email Validation (should end with @uncc.edu or @charlotte.edu)
    if (!email || !/(.*)@(uncc\.edu|charlotte\.edu)$/i.test(email)) {
      newErrors.email = "Please enter a valid university email (ending with @uncc.edu or @charlotte.edu).";
    }

    // Password Validation
    if (!password || password.length < 6) {
      newErrors.password = "Password should be at least 6 characters long.";
    }
    console.log( newErrors );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return; // Don't proceed if validation fails
    }
    
    try { 
      const response = await registerUser({ 
        firstName, 
        lastName, 
        studentId, 
        email, 
        password, 
        isAdmin // Include admin status in the payload
      });

      if( !response.data.success ){
        alert( response.data.message );
      }
      console.log( response.data.user );
      if( response.data.user.isAdmin ){
        localStorage.setItem('role',"instructor")
      }
      else{
        localStorage.setItem('role',"student")
      }
      setloginUser();
      alert(response.data.message);
      navigate("/workflow");
    } catch (error) {
      console.log( error );
      alert("Registration failed: " + error.response?.data?.error || error.message);
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
              <h2 className="text-center mb-4">Register</h2>
              <Form onSubmit={handleRegister}>
                <Form.Group controlId="formFirstName" className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    isInvalid={errors.firstName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    isInvalid={errors.lastName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Admin Checkbox */}
                <Form.Group controlId="formAdmin" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Are you an Instructor?"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)} // Handle checkbox change
                  />
                </Form.Group>

                { !isAdmin ?
                  <Form.Group controlId="formStudentId" className="mb-3">
                    <Form.Label>Student ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      isInvalid={errors.studentId}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.studentId}
                    </Form.Control.Feedback>
                  </Form.Group>
                  : <></>
                }

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>University Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your university email"
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

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;