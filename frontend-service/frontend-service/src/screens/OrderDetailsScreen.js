import React, { useEffect, useState } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
  Button
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder }  from '../actions/orderActions'
import{ ORDER_PAY_RESET, ORDER_DELIVERY_RESET} from '../constants/orderConstants'


const OrderDetailsScreen = () => {
  const dispatch = useDispatch()
  const { id } = useParams()

  const [sdkReady, setSdkReady] = useState(false)
  const orderDetails = useSelector(state => state.orderDetails)
  const { order, loading, error} = orderDetails

  const orderPay = useSelector(state => state.orderPay)
  const { loading: loadingPay, success:successPay} = orderPay

  const orderDeliver = useSelector(state => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver} = orderDeliver

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo  } = userLogin

  if(!loading){
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
  
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );  
  }

  useEffect(() => {
    const addPayPalScript = async () => {
      const CHECKOUT_API_ENDPOINT = process.env.REACT_APP_CHECKOUT_SERVICE_ENDPOINT || 'http://localhost:8001'
      const { data: clientId } = await axios.get(`${CHECKOUT_API_ENDPOINT}/api/config/paypal`)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src= `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if(!order || order._id !== id || successPay || successDeliver) {
        dispatch ({type: ORDER_PAY_RESET })
        dispatch ({type: ORDER_DELIVERY_RESET })
        dispatch(getOrderDetails(id))
    } else if (!order.isPaid){
      if(!window.paypal) {
        addPayPalScript()
      }else {
        setSdkReady(true)
      }
    }
  }, [dispatch, order, id, successPay, successDeliver])

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      dispatch(payOrder(id, details))
    })
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return (
    loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> :
    <>
      <h1>
        Order {order._id}
      </h1>
      <Container>
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p><strong>Name: </strong> {order.user.name}</p>
                <p>
                  <strong>Email: </strong>
                  <a href={`mailto:${order.user.email}`}></a> {order.user.email}
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address},
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.city},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (<Message variant='success'>Delivered on {order.deliveredAt}</Message>) : (
                  <Message variant='danger'>Not Delivered</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment </h2>
                <p>
                  <strong>Method: </strong>
                  {order.payment}
                </p>
                {order.isPaid ? (<Message variant='success'>Paid on {order.paidAt}</Message>) : (
                  <Message variant='danger'>Not Paid</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.img}
                              alt={item.name}
                              fluid
                              rounded
                            ></Image>
                          </Col>
                          <Col>
                            <Link to={`product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x €{item.price} = €
                            {item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Container>
                    <Row>
                      <Col>Items</Col>
                      <Col>€{order.itemsPrice}</Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Container>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>€{order.shippingPrice}</Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Container>
                    <Row>
                      <Col>Tax</Col>
                      <Col>€{order.taxPrice}</Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Container>
                    <Row>
                      <Col>Total Price</Col>
                      <Col>€{order.totalPrice}</Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader/>}
                    {!sdkReady ? <Loader/> : (
                      <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                      <PayPalButtons
                        style={{
                          layout: "horizontal"
                        }}
                        createOrder={(data, actions) => {
                          return actions.order
                            .create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: order.totalPrice
                                  },
                                },
                              ],
                            })
                        }}
                        onApprove={onApprove}
                      />
                      </PayPalScriptProvider>
                    )}
                  </ListGroup.Item>
                )}
                {loadingDeliver && <Loader/>}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    <Button type='button'className="btn btn-primary" onClick={deliverHandler}>
                      Mark As Delivered  
                    </Button>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrderDetailsScreen;
