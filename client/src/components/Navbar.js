import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Text, Heading, Image } from 'gestalt';

const Navbar = () => (

    <Box display="flex" alignItems="center" justifyContent="around" height={70} color="midnight" padding={5} shape="roundedBottom" >

        {/* signup link */}
        <NavLink activeClassName="active" to="/signup">
            <Text size="xl" color="white">Sign Up</Text>
        </NavLink>

        {/* logo/home link */}
        <NavLink activeClassName="active" exact to="/">
            <Box display="flex" alignItems="center">
                <Box margin={2} height={50} width={50}>
                    <Image src="./icons/logo.svg" alt="Bummer" naturalWidth={1} naturalHeight={1} />
                </Box>
                <Heading size="xs" color="orange">Boring Online Store</Heading>
            </Box>
        </NavLink>

        {/* signin link */}
        <NavLink activeClassName="active" to="/signin">
            <Text size="xl" color="white">Sign In</Text>
        </NavLink>
    </Box>
);

export default Navbar;
