import React from "react";
import { Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export const Product = ({ product }) => {
  return (
    <Card className="my-3 mx-0" style={{ width: "100%" }}>
      <LinkContainer to={`/product/${product._id}`}>
        <Card.Img src={product.img} variant="top" />
      </LinkContainer>
      <Card.Body>
        <Card.Title className="mb-0" style={{ fontSize: "0.8rem" }} as="div">
          {product.title}
        </Card.Title>
        <Card.Text as="div">
          <div style={{ fontSize: "0.8rem" }} className="text-muted py-0">
            {product.categories[0]}
          </div>
        </Card.Text>
        <Card.Text>€ {product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
