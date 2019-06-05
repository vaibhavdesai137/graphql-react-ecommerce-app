import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Text, Heading } from 'gestalt';

const Navbar = () => (

    <Box display="flex" alignItems="center" justifyContent="around" height={70} color="midnight" padding={5} shape="roundedBottom" >

        {/* signup link */}
        <NavLink activeClassName="active" to="/signup">
            <Text size="xl" color="white">Sign Up</Text>
        </NavLink>

        {/* logo/home link */}
        <NavLink activeClassName="active" exact to="/">
            <Box display="flex" alignItems="center">
                <Heading size="xs" color="orange">
                    --Infamous Beer Store--
                </Heading>
            </Box>
        </NavLink>

        {/* signin link */}
        <NavLink activeClassName="active" to="/signin">
            <Text size="xl" color="white">Sign In</Text>
        </NavLink>
    </Box>
);

export default Navbar;
