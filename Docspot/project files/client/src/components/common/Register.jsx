import React, { useState } from "react";
import {
  Container,
  Nav,
  Navbar,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";


const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    type: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/register",
        user
      );
      if (res.data.success) {
        message.success("Registered Successfully");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <Link to="/">MedicoHub</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Link to="/" className="mx-3">
                Home
              </Link>
              <Link to="/login" className="mx-3">
                Login
              </Link>
              <Link to="/register" className="mx-3">
                Register
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Background Image Wrapper */}
      <div
        style={{
          backgroundImage:
            "url('https://tse4.mm.bing.net/th/id/OIP.cFCm-t3KhEz9mzzHvAKuUQHaDt?pid=Api&P=0&h=180')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          padding: "40px 0",
        }}
      >
       
        <Container className="my-5">
         
          <Row
            className="p-3 shadow-lg"
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: "10px",
            }}
          >
            <Col md={6} className="p-4">
              <h2 className="fw-bold mb-4">Sign up to your account</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    
                    style={{ border: '2px solid black' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    
                    style={{ border: '2px solid black' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    
                    style={{ border: '2px solid black' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    
                    style={{ border: '2px solid black' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>User Type</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      name="type"
                      value="admin"
                      checked={user.type === "admin"}
                      onChange={handleChange}
                      label="Admin"
                    />
                    <Form.Check
                      inline
                      type="radio"
                      name="type"
                      value="user"
                      checked={user.type === "user"}
                      onChange={handleChange}
                      label="User"
                    />
                  </div>
                </Form.Group>

                <Button className="bg-dark" type="submit" size="lg">
                  Register
                </Button>

                <p className="mt-3" style={{ color: "#393f81" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#393f81" }}>
                    Login here
                  </Link>
                </p>
              </Form>
            </Col>

           <Col
  md={6}
  className="d-flex justify-content-center align-items-center"
>
  <div className="eyes-container">
    <div className="eye">
      <div className="ball"></div>
    </div>
    <div className="eye">
      <div className="ball"></div>
    </div>
  </div>
</Col>

          </Row>
         
           </Container>
      </div>
       
        
    </>
  );
};

export default Register;
