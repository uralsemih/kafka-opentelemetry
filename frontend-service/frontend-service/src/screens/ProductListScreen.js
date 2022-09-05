import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProducts, deleteProduct, createProduct } from "../actions/productActions";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productList = useSelector(state => state.productList);
  const { loading, error, products } = productList

  const productDelete = useSelector(state => state.productDelete);
  const { loading: loadingDelete , error: errorDelete, success: successDelete } = productDelete

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo  } = userLogin

  useEffect(() => {
    if(userInfo && userInfo.isAdmin){
      dispatch(listProducts())
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userInfo, successDelete])

  const deleteHandler = (id) => {
    if(window.confirm("Are you sure to delete this product?")){
      dispatch(deleteProduct(id))
    }
  }

  return (
    <>
        <Container>
            <Row className="align-item-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-right">
                  <LinkContainer to={`/admin/product/create`}>
                      <Button className='btn btn-primary my-3 mx-auto ms-auto'>
                        <i className='fas fa-plus'>Create Product</i>
                      </Button>
                  </LinkContainer>
                </Col>
            </Row>
        </Container>
      {loadingDelete && <Loader/>}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.title}</td>
                <td>
                    €{product.price}
                </td>
                <td>
                    {product.categories[0]},
                    {product.categories[1]}
                </td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
};

export default ProductListScreen;
