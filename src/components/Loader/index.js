import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = () => {
    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Typography align="center" variant="h5">Loading</Typography>
                <Typography align="center"> <CircularProgress /> </Typography>
            </Box>
        </div>
    );
}

export default Loader;