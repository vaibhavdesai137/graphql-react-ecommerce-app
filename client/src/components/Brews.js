import React, { Component } from 'react';
import Loader from './Loader';
import { Container, Box, Heading, Card, Image, Text, Button } from 'gestalt';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';

const API_URL = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(API_URL);

class Brews extends Component {

  state = {
    brandName: '',
    brews: [],
    loadingBrews: true
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

      this.setState({
        brandName: response.data.brand.name,
        brews: response.data.brand.brews,
        loadingBrews: false
      });

    } catch (e) {
      console.log(e);
      this.setState({ loadingBrews: false });
    }
  }

  render() {

    const { brandName, brews, loadingBrews } = this.state;

    return (

      <Container>

        <Box display="flex" justifyContent="center" marginTop={4} alignItems="start">

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
                            <Button color="blue" text="Add To Cart" />
                          </Text>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ))
              }
            </Box>

            {/* Show custom loader when loading */}
            <Loader show={loadingBrews} />

          </Box>
        </Box>
      </Container>
    );
  }
}

export default Brews;
