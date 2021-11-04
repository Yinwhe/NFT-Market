import React, { useState, useEffect } from "react";
import { Typography, Grid, Paper, styled } from '@mui/material';
import ImageCard from "../MintedImages/ImageCard";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Marketplace = ({
  accountAddress,
  Images,
  Contract,
  Auctions,
  currentTime,
}) => {
  const allImages = Images.filter(
    (image) => image.status != 0
  );
  let ImageCount = allImages.length;
  return (
    <div>
      <br />
      <Typography gutterBottom variant="h4">
        Total number of Images in the Marketplace : {ImageCount}
      </Typography>
      <Grid container spacing={2}>
        {allImages.map((image) => {
          console.log("=== Test ===", image, Auctions[parseInt(image.tokenID) - 1])
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

export default Marketplace;