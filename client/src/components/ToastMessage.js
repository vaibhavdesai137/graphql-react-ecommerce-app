import React from 'react';
import { Toast, Box } from 'gestalt';

const ToastMessage = ({ showToast, toastMsg }) => (

    showToast
    &&
    (
        <Box
            position="fixed"
            dangerouslySetInlineStyle={{
                __style: {
                    bottom: 20,
                    left: '50%',
                    transform: "translateX(-50%)"
                }
            }}
        >
            <Toast color="orange" text={toastMsg} />
        </Box>
    )
);

export default ToastMessage;
