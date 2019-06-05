import React, { Component } from 'react';
import './App.css';
import { Container, Box, Heading, Text, TextField, Button } from 'gestalt';
import ToastMessage from './ToastMessage';
import { setToken } from '../utils/helpers';
import Strapi from 'strapi-sdk-javascript/build/main';

const API_URL = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(API_URL);

class Signin extends Component {

  state = {
    username: '',
    password: '',
    showToast: false,
    toastMsg: '',
    loading: false
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {

    // no reloading of page on submit
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all the fields please...");
      return;
    }

    // submit flow:
    // set loading to true
    // login user with strapi
    // save token to local storage (to manage sessions)
    // set loading to false
    // redirect to homepage
    const { username, password } = this.state;
    try {
      this.setState({ loading: true });
      const response = await strapi.login(username, password);
      setToken(response.jwt);
      this.setState({ loading: false });
      this.redirectUser('/');
    } catch (e) {
      this.setState({ loading: false });
      this.showToast(e.message);
    }

  }

  redirectUser = (path) => {
    this.props.history.push(path);
  }

  showToast = (msg) => {
    this.setState({ showToast: true, toastMsg: msg });
    setTimeout(() => {
      this.setState({ showToast: false, toastMsg: '' })
    }, 3000);
  }

  isFormEmpty = ({ username, password }) => {
    return !username || !password;
  }

  render() {

    const { showToast, toastMsg, loading } = this.state;

    return (
      <Container>
        <Box margin={4} padding={4} shape="rounded" display="flex" justifyContent="center"
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6a3b1"
            }
          }}
        >
          <form style={{
            display: 'inlineBlock',
            textAlign: 'center',
            maxWidth: 450
          }}
            onSubmit={this.handleSubmit}
          >

            {/* Sign in form heading */}
            <Box marginBottom={2} display="flex" direction="column" alignItems="center">
              <Heading size="sm" color="midnight">Welcome back!</Heading>
              <Text italic color="orchid"></Text>
            </Box>

            <Box marginTop={10}>
              <TextField
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                onChange={this.handleChange}
              />
            </Box>

            <Box marginTop={3}>
              <TextField
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={this.handleChange}
              />
            </Box>

            <Box marginTop={3}>
              <Button inline dusabled={loading} color="blue" text="Submit" type="submit"></Button>
            </Box>

          </form>
        </Box>
        <ToastMessage showToast={showToast} toastMsg={toastMsg} />
      </Container>
    );
  }
}

export default Signin;
