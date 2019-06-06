import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Box, Text, Heading, Button } from 'gestalt';
import { getToken, clearToken, clearCart } from '../utils/helpers';

// show the navbar conditionally based on token in localstorage
class Navbar extends Component {

    // signout flow:
    // clear token
    // clear cart
    // redirect to homepage
    handleSignout = () => {
        clearToken();
        clearCart();
        this.props.history.push('/');
    }

    render() {
        // handleSignout is a function on this component
        // for AuthNavbar to use it, it will need access
        // hence, pass it along 
        return getToken() !== null ?
            <AuthNavbar handleSignout={this.handleSignout} /> : <UnAuthNavbar />
    }
};

const AuthNavbar = ({ handleSignout }) => (

    <Box display="flex" alignItems="center" justifyContent="around" height={70} color="midnight" padding={5} shape="roundedBottom" >

        {/* checkout link */}
        <NavLink activeClassName="active" to="/checkout">
            <Text size="xl" color="white">Checkout</Text>
        </NavLink>

        {/* logo/home link */}
        <NavLink activeClassName="active" exact to="/">
            <Box display="flex" alignItems="center">
                <Heading size="xs" color="orange">
                    Beer Store
                </Heading>
            </Box>
        </NavLink>

        {/* signout button */}
        <Button inline onClick={handleSignout} size="md" color="transparent" text="Sign Out" />

    </Box>
);

const UnAuthNavbar = () => (

    <Box display="flex" alignItems="center" justifyContent="around" height={70} color="midnight" padding={5} shape="roundedBottom" >

        {/* signup link */}
        <NavLink activeClassName="active" to="/signup">
            <Text size="xl" color="white">Sign Up</Text>
        </NavLink>

        {/* logo/home link */}
        <NavLink activeClassName="active" exact to="/">
            <Box display="flex" alignItems="center">
                <Heading size="xs" color="orange">
                    Beer Store
                </Heading>
            </Box>
        </NavLink>

        {/* signin link */}
        <NavLink activeClassName="active" to="/signin">
            <Text size="xl" color="white">Sign In</Text>
        </NavLink>
    </Box>
);

// using withRouter so we can access the "history" prop for redirection
export default withRouter(Navbar);
