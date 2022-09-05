import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { createProduct } from "../actions/productActions";
import { PRODUCT_LIST_SUCCESS } from "../constants/productConstants"

const ProductCreateScreen = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("")
  const [img, setImg] = useState("")
  const [category, setCategory] = useState("")
  const [size, setSize] = useState("")
  const [price, setPrice] = useState(0)
  const [countInStock, setCountInStock] = useState(0)

  const productCreate = useSelector(state => state.productCreate);
  const { loading: loadingCreate , error: errorCreate, success: successCreate} = productCreate

  useEffect(() => {
    if(successCreate) {
        navigate('/admin/productlist')
      }
    }, [navigate,successCreate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const categories = category.split(",");
    dispatch(createProduct({
      title,
      desc,
      img,
      categories,
      size,
      price,
      countInStock
    }))
  };

  return (
    <>
      <Link to='/admin/productlist' className="btn btn-primary my-3">Go Back</Link>
      <FormContainer>
      <h1> Create Product</h1>
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loadingCreate ? <Loader /> : errorCreate ? <Message variant="danger">{errorCreate}</Message> : (
          <Form onSubmit={submitHandler}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="desc">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="img">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image url"
              value={img}
              onChange={(e) => setImg(e.target.value)}
            ></Form.Control>
          </Form.Group>
  
          <Form.Group controlId="categories">
            <Form.Label>Categories</Form.Label>
            <Form.Control
              type="text"
              placeholder="Fitness and Training, Men"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="size">
            <Form.Label>Size</Form.Label>
            <Form.Control
              type="text"
              placeholder="M"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value,10))}
            ></Form.Control>
          </Form.Group>
  
          <Form.Group controlId="countInStock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter stock"
              value={countInStock}
              onChange={(e) => setCountInStock(parseInt(e.target.value,10))}
            ></Form.Control>
          </Form.Group>
    
          <Container className="">
            <Row>
              <Col>
                <Button type="submit" variant="primary" className="my-2">
                  Create
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      )}
      </FormContainer>
    </>

  );
};

export default ProductCreateScreen;