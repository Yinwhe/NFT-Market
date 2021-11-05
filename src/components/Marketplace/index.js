import React from "react";
import { Typography, Stack, Paper, styled } from '@mui/material';
import ImageCard from "../ImageCard/ImageCard";

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
    <div><br />
      <h2>
        Total number of Images in the Marketplace : {ImageCount}
      </h2><hr /><br />
      <Stack elevation={12} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
        {allImages.map((image) => {
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

export default Marketplace;