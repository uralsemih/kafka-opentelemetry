import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import  Message  from "../components/Message";
import  Loader  from "../components/Loader";

export const HomeScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <>
      <Container className="my-3">
        <h3>Latest Products</h3>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger  ">{error}</Message>
        ) : (
          <Container>
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          </Container>
        )}
      </Container>
    </>
  );
};
