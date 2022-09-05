import React from "react";
import { Row, Col, Container } from "react-bootstrap";

export const Footer = () => {
  return (
    <footer>
      <Container fluid className="copyright" >
        <Row >
          <Col className="text-center text-dark py-3">
            Copyright &copy; adidas
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
