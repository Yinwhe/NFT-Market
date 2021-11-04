import React from 'react';
import { Box, LinearProgress, CircularProgress, Typography } from '@mui/material';

const Loader = () => {
    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
                <br />
                <Typography align="center"> Loading</Typography>
                <Typography align="center"> <CircularProgress/> </Typography>
            </Box>
        </div>
    );
}

export default Loader;