import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Heading, Card, Image, Text, Button, Mask, IconButton } from 'gestalt';
import './App.css';
import { calculateTotalPrice, setCart, getCart } from '../utils/helpers';
import Strapi from 'strapi-sdk-javascript/build/main';

const API_URL = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(API_URL);

class Brews extends Component {

  state = {
    brandName: '',
    brews: [],
    cartItems: []
  }

  componentDidMount() {
    const brandId = this.props.match.params.brandId;
    this.getBrewsByBrand(brandId);
  }

  getBrewsByBrand = async (brandId) => {

    try {

      const query = `query {
        brand(id: "${brandId}") {
          _id
          name
          brews {
            _id
            name
            description
            price
            image {
              url
            }
          }
        }
      }`;

      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: query
        }
      });

      // Update state and check local stoarge to see if any items were in cart
      this.setState({
        brandName: response.data.brand.name,
        brews: response.data.brand.brews,
        cartItems: getCart()
      });

    } catch (e) {
      console.log(e);
    }
  }

  // Dumb cart, cannot update quanity
  addToCart = (brew) => {

    const alreadyAddedToCart = this.state.cartItems.findIndex(item => item._id === brew._id);

    if (alreadyAddedToCart === -1) {

      // Add the new brew to cart
      const updatedItems = this.state.cartItems.concat({
        ...brew
      });

      // Update state and then update local storage
      this.setState({
        cartItems: updatedItems
      }, () => setCart(updatedItems));
    }

  }

  removeFromCart = (itemId) => {

    // Get all items from cart except the one that needs to be removed
    const filteredItems = this.state.cartItems.filter(
      item => item._id !== itemId
    );

    // Update state and then update local storage
    this.setState({
      cartItems: filteredItems
    }, () => setCart(filteredItems));
  }

  render() {

    const { brandName, brews, cartItems } = this.state;

    return (

      <Container>

        <Box marginTop={4} display="flex" justifyContent="center" alignItems="start"
          dangerouslySetInlineStyle={{
            __style: {
              flexWrap: "wrap-reverse"
            }
          }}
        >
          {/* Brews section */}
          <Box display="flex" direction="column" alignItems="center">

            {/* Brand the brew belongs to */}
            <Box margin={2}>
              <Heading color="orchid">{brandName}</Heading>
            </Box>

            {/* Brews */}
            <Box
              dangerouslySetInlineStyle={{
                __style: {
                  backgroundColor: "#bdcdd9"
                }
              }}
              wrap
              shape="rounded"
              display="flex"
              justifyContent="center"
              padding={4}
            >
              {
                brews.map(brew => (
                  <Box paddingY={4} margin={2} width={210} key={brew._id}>
                    <Card image={
                      <Box height={250} width={200}>
                        <Image fit="cover" alt="Brew" naturalHeight={1} naturalWidth={1} src={`${API_URL}${brew.image.url}`} />
                      </Box>}
                    >
                      <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                        <Text bold size="xl">{brew.name}</Text>
                        <Box marginTop={2}>
                          <Text>{brew.description.substring(0, 75)}...</Text>
                        </Box>
                        <Box marginTop={2}>
                          <Text bold color="orchid">${brew.price}</Text>
                        </Box>
                        <Box marginTop={2}>
                          <Text bold size="md">
                            <Button onClick={() => this.addToCart(brew)} color="blue" text="Add To Cart" />
                          </Text>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ))
              }
            </Box>
          </Box>

          {/* Cart */}
          <Box alignSelf="end" marginTop={2} marginLeft={8}>
            <Mask shape="rounded" wash>
              <Box display="flex" alignItems="center" padding={2} direction="column">
                <Heading align="center" size="sm">Your Cart</Heading>
                <Box marginTop={2}>
                  <Text color="gray" italic>{cartItems.length} item(s) in cart</Text>
                </Box>

                {/* Cart items */}
                {cartItems.map(item => (
                  <Box key={item._id} display="flex" alignItems="center">
                    <Text>${item.price} - {item.name}</Text>
                    <IconButton accessibilityLabel="deleteItem" icon="cancel" iconColor="red" size="sm"
                      onClick={() => this.removeFromCart(item._id)} />
                  </Box>
                ))}

                <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                  <Box marginTop={2}>
                    {
                      cartItems.length === 0 && (
                        <Text color="red">Cart is empty</Text>
                      )
                    }
                  </Box>
                  <Text bold size="sm">------</Text>
                  <Text size="sm">Total: ${calculateTotalPrice(cartItems)}</Text>
                  <Box marginTop={2}>
                    <Text bold>
                      <Link to="/checkout">Checkout</Link>
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Mask>
          </Box>
        </Box>
      </Container>
    );
  }
}

export default Brews;
