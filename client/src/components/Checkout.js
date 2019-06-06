import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.css';
import { Container, Box, Heading, TextField, Text, Modal, Button, Spinner } from 'gestalt';
import { Elements, StripeProvider, CardElement, injectStripe } from 'react-stripe-elements';
import ToastMessage from './ToastMessage';
import { getCart, calculateTotalPrice, calculateTotalPriceNumber, clearCart } from '../utils/helpers';
import Strapi from 'strapi-sdk-javascript/build/main';

const API_URL = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(API_URL);

class _CheckoutForm extends Component {

  state = {
    street: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    cartItems: [],
    showToast: false,
    toastMsg: '',
    showModal: false,
    orderProcessing: false
  }

  // Fetch the cart from localstoarge for checkout
  componentDidMount() {
    this.setState({ cartItems: getCart() });
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  handleConfirmOrder = async (event) => {

    // no reloading of page on submit
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all the fields please...");
      return;
    }

    this.setState({ showModal: true });

  }

  handleSubmitOrder = async () => {

    // submit flow:
    // set orderProcessing to true
    // save order with strapi (which will call stripe for payment)
    // send email
    // set orderProcessing to false
    // set showModal to false
    // clear cart
    // show success toast
    // redirect to homepage

    //
    // THE CREATE ORDER API IN STRAPI IS MODIFIED TO WORK WITH STRIPE
    // server/api/order/controllers/Order.js 
    //

    this.setState({ orderProcessing: true });

    const { street, city, state, zip, email, cartItems } = this.state;
    let stripeToken;

    try {

      // get stripe token
      const stripeResponse = await this.props.stripe.createToken();
      stripeToken = stripeResponse.token.id;

      // final amount in number
      const amount = calculateTotalPriceNumber(cartItems);

      // save order with strapi (pass the stripe token)
      await strapi.createEntry('orders', {
        street: street,
        city: city,
        state: state,
        zip: zip,
        email: email,
        brews: cartItems,
        amount: amount,
        stripeToken: stripeToken
      });

      // send email
      await strapi.request('POST', '/email', {
        data: {
          to: email,
          subject: `Order confirmation - ${new Date(Date.now())}`,
          text: 'Your order has been successfully placed.',
          html: '<bold>Your order should arrive within the next 2-3 business days.</bold>'
        }
      })

      // cleanup
      this.setState({ orderProcessing: false, showModal: false });
      clearCart();
      this.showToast("Great!!! Order successfully placed.", true);

    } catch (e) {
      this.setState({ orderProcessing: false, showModal: false });
      this.showToast(e.message);
    }

  }

  // If redirect is true (only after order placed), then redirect to homepage
  showToast = (msg, redirect = false) => {
    this.setState({ showToast: true, toastMsg: msg });
    setTimeout(() => {
      this.setState({
        showToast: false,
        toastMsg: ''
      }, () => redirect && this.props.history.push('/'))
    }, 3000);
  }

  isFormEmpty = ({ street, city, state, zip, email }) => {
    return !street || !city || !state || !zip || !email;
  }

  render() {

    const { showToast, toastMsg, cartItems, showModal, orderProcessing } = this.state;

    return (
      <Container>

        <Box margin={4} padding={4} shape="rounded" display="flex" justifyContent="center" alignItems="center" direction="column" color="darkWash">

          {/* Checkout form heading */}
          <Heading size="sm" color="midnight">Checkout</Heading>

          {cartItems.length > 0 ?

            <React.Fragment>

              {/* Cart Items */}
              <Box display="flex" justifyContent="center" alignItems="center" direction="column" marginTop={2} marginBottom={6}>
                <Text color="darkGray" italic>{cartItems.length} item(s) for checkout</Text>
                <Box padding={2}>
                  {
                    cartItems.map(item => (
                      <Box key={item._id} padding={1}>
                        <Text color="midnight">${item.price} - {item.name}</Text>
                      </Box>
                    ))
                  }
                </Box>
                <Text bold>--------------------</Text>
                <Text bold>Total amount: {calculateTotalPrice(cartItems)}</Text>
                <Text bold>--------------------</Text>
              </Box>

              <form onSubmit={this.handleConfirmOrder} style={{
                display: 'inlineBlock',
                textAlign: 'center',
                maxWidth: 450
              }} >

                <Box marginTop={10}>
                  <TextField
                    id="street"
                    name="street"
                    type="text"
                    placeholder="Street"
                    onChange={this.handleChange}
                  />
                </Box>

                <Box marginTop={3}>
                  <TextField
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City"
                    onChange={this.handleChange}
                  />
                </Box>

                <Box marginTop={3}>
                  <TextField
                    id="state"
                    name="state"
                    type="text"
                    placeholder="State"
                    onChange={this.handleChange}
                  />
                </Box>

                <Box marginTop={3}>
                  <TextField
                    id="zip"
                    name="zip"
                    type="text"
                    placeholder="Zipcode"
                    onChange={this.handleChange}
                  />
                </Box>

                <Box marginTop={3}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Confirmation Email"
                    onChange={this.handleChange}
                  />
                </Box>

                {/* Stripe card element */}
                <CardElement style={{ paddingTop: '30px' }} id="stripe__input" onReady={input => input.focus()} />

                <Box marginTop={3}>
                  <button id="stripe__button" type="submit"
                    style={{
                      marginTop: "30px",
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      fontSize: '20px',
                      height: '50px',
                      width: '400px',
                      borderRadius: '10px'
                    }} >
                    Place Order
                    </button>
                </Box>

              </form>

            </React.Fragment>
            :
            <Box margin={3}><Text>Cart is empty</Text></Box>
          }

        </Box>

        {/* Confirmation modal */}
        {showModal && (
          <ConfirmationModal
            key="confirmModal"
            orderProcessing={orderProcessing}
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder} />
        )}

        {/* Show alert  when errored */}
        <ToastMessage showToast={showToast} toastMsg={toastMsg} />

      </Container>
    );
  }
}

const ConfirmationModal = ({ orderProcessing, cartItems, closeModal, handleSubmitOrder }) => (
  <Modal
    key="modal"
    role="alertdialog"
    size="sm"
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm your order"
    heading="Comfirm your order"
    onDismiss={closeModal}
    footer={
      <Box display="flex" marginRight={-1} marginLeft={-1} justifyContent="center">
        <Box padding={1}>
          <Button size="sm" color="blue" text="Place Order"
            disabled={orderProcessing}
            onClick={handleSubmitOrder} />
        </Box>
        <Box padding={1}>
          <Button size="sm" color="red" text="Cancel Order"
            disabled={orderProcessing}
            onClick={closeModal} />
        </Box>
      </Box>
    }
  >
    {/* Order summary */}
    {!orderProcessing && (
      <Box dispaly="flex" alignItems="center" direction="column" padding={2} justifyContent="center" color="lightWash">
        {
          cartItems.map(item => (
            <Box>
              <Box key={item._id} padding={1}>
                <Text color="midnight">${item.price} - {item.name}</Text>
              </Box>
            </Box>
          ))
        }
        <Box padding={2}>
          <Text bold>Total amount: ${calculateTotalPrice(cartItems)}</Text>
        </Box>
      </Box>
    )}

    {/* Order processing spinner */}
    {orderProcessing && (
      <Box>
        <Spinner show={orderProcessing} accessibilityLabel="spinner" />
        <Text align="center" italic>Submitting order...</Text>
      </Box>
    )}

  </Modal>
);

// Stripe stuff
const CheckoutForm = withRouter(injectStripe(_CheckoutForm));
const Checkout = () => (
  <StripeProvider apiKey="pk_test_9EpJIw0Vn4iNuGF5Rky6EF1u00Eq8VjwLn">
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
)

export default Checkout;
