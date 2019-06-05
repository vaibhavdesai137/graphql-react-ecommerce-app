import React from 'react';
import { GridLoader } from 'react-spinners';
import { Box } from 'gestalt';

{/* Show custom loader when loading */}
const Loader = ({ show }) => (

    show
    &&
    <Box
        position="fixed"
        dangerouslySetInlineStyle={{
            __style: {
                bottom: 100,
                left: '50%',
                transform: "translateX(-50%)"

            }
        }}
    >
        <GridLoader color="darkorange" size={30} margin="5px" />
    </Box>

);

export default Loader;
