import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon } from 'gestalt';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';

const API_URL = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(API_URL);

class App extends Component {

  state = {
    brands: [],
    searchTerm: ''
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

      this.setState({ brands: response.data.brands });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  handleSearch = (event) => {
    this.setState({ searchTerm: event.value });
  }

  // search the name or desc
  filteredBrands = ({ brands, searchTerm }) => {
    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }

  render() {

    const { searchTerm } = this.state;

    return (

      <Container>

        {/* Search Box */}
        <Box display="flex" justifyContent="center" marginTop={4} >
          <SearchField id="searchField" placeholder="Search here..."
            onChange={this.handleSearch}
            value={searchTerm}
          />
          <Box margin={2}>
            <Icon
              icon="filter"
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
            />
          </Box>
        </Box>

        {/* Title */}
        <Box display="flex" justifyContent="center" margin={5} >
          <Heading color="midnight" size="md" >
            Our Beer Brands
          </Heading>
        </Box>

        {/* All brands */}
        <Box wrap shape="rounded" display="flex" justifyContent="around" margin={2} >
          {
            this.filteredBrands(this.state).map(brand => (
              <Box key={brand._id} margin={2} width={200}>
                <Card image={
                  <Box height={200} width={200}>
                    <Image alt="Brand" naturalHeight={1} naturalWidth={1} src={`{API_URL}{brand.image.url}`} />
                  </Box>}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" direction="column" >
                    <Text bold size="xl">{brand.name}</Text>
                    <Text>{brand.description}</Text>
                    <Text bold size="xl">
                      <Link to={`/{brand._id}`}>
                        See Brews
                    </Link>
                    </Text>
                  </Box>
                </Card>
              </Box>
            ))
          }
        </Box>

      </Container>
    );
  }
}

export default App;
