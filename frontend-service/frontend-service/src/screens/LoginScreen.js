import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (userInfo) {
      navigate(redirect ?? "/", { replace: true });
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1> Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Container className="">
          <Row>
            <Col>
              <Button type="submit" variant="primary" className="my-2">
                Sign In
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>

      <Row className="py-3">
        <Col>
          New User?{" "}
          <Link to={'/register?redirect=/'}>
            Sign Up
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
