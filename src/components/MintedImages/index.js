import React from "react";
import ImageCard from "./ImageCard"
import { Typography, Grid, Box, Paper, styled } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const MintedImages = ({
  accountAddress,
  Images,
  ImageNumOfAccount,
  Contract,
  Auctions,
  currentTime,
}) => {
  const myImages = Images.filter(
    (image) => image.currentOwner === accountAddress
  );
  return (
    <div>
      <br />
      <Typography gutterBottom variant="h4">
        Total number of NFTs You Own : {ImageNumOfAccount}
      </Typography>
      <Grid container spacing={2}>
        {myImages.map((image) => {
          return (
            <Grid item xs key={image.tokenID}>
              <Item>
                <ImageCard
                  tokenID={image.tokenID}
                  image={image}
                  accountAddress={accountAddress}
                  Contract={Contract}
                  Auction={Auctions[parseInt(image.tokenID) - 1]}
                  currentTime={currentTime}
                />
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default MintedImages;