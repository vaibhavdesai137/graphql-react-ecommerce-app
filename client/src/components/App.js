import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon } from 'gestalt';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';

const API_URL = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(API_URL);

class App extends Component {

  state = {
    brands: [],
    searchTerm: '',
    loadingBrands: true
  }

  componentDidMount() {
    this.getBrands();
  }

  getBrands = async () => {

    try {

      const query = `query {
        brands {
          _id
          name
          description
          image {
            url
          }
        }
      }`;

      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: query
        }
      });

      this.setState({ brands: response.data.brands, loadingBrands: false });
    } catch (e) {
      console.log(e);
      this.setState({ loadingBrands: false });
    }
  }

  handleSearch = (event) => {
    this.setState({ searchTerm: event.value }, () => this.searchBrands());
  }

  // search by name
  searchBrands = async () => {
    try {
      const query = `query {
        brands (where: {
          name_contains: "${this.state.searchTerm}"
        }) {
          _id
          name
          description
          image {
            url
          }
        }
      }`;

      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: query
        }
      });

      this.setState({ brands: response.data.brands, loadingBrands: false });
    } catch (e) {
      console.log(e);
      this.setState({ loadingBrands: false });
    }
  }

  render() {

    const { searchTerm, loadingBrands, brands } = this.state;

    return (

      <Container>

        {/* Search Box */}
        <Box display="flex" justifyContent="center" marginTop={4} >
          <SearchField id="searchField" placeholder="Search here..."
            onChange={this.handleSearch}
            value={searchTerm}
            accessibilityLabel="search"
          />
          <Box margin={2}>
            <Icon
              icon="filter"
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
              accessibilityLabel="icon"
            />
          </Box>
        </Box>

        {/* Title */}
        <Box display="flex" justifyContent="center" margin={5}>
          <Heading color="midnight" size="md">
            Our Beer Brands
          </Heading>
        </Box>

        {/* All brands */}
        <Box wrap shape="rounded" display="flex" justifyContent="around" margin={2} >
          {
            brands.map(brand => (
              <Box key={brand._id} margin={2} width={200}>
                <Card image={
                  <Box height={200} width={200}>
                    <Image alt="Brand" naturalHeight={1} naturalWidth={1} src={`${API_URL}${brand.image.url}`} />
                  </Box>}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                    <Text bold size="xl">{brand.name}</Text>
                    <Box marginTop={2}>
                      <Text>{brand.description.substring(0, 75)}...</Text>
                    </Box>
                    <Box marginTop={2}>
                      <Text bold size="md">
                        <Link to={`/${brand._id}`}>
                          See Brews
                      </Link>
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))
          }
        </Box>

        {/* Show custom loader when loading */}
        <Loader show={loadingBrands} />

      </Container>
    );
  }
}

export default App;
