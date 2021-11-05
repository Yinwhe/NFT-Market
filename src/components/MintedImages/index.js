import React from "react";
import ImageCard from "../ImageCard/ImageCard"
import { Typography, Stack, Paper, styled } from '@mui/material';

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
      <Stack elevation={12} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
        {myImages.map((image) => {
          return (
            <Item key={image.tokenID}>
              <ImageCard
                tokenID={image.tokenID}
                image={image}
                accountAddress={accountAddress}
                Contract={Contract}
                Auction={Auctions[parseInt(image.tokenID) - 1]}
                currentTime={currentTime}
              />
            </Item>
          );
        })}
      </Stack>
    </div>
  );
};

export default MintedImages;