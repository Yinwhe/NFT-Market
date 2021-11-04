import React, { useState, useEffect } from "react";
import ImageCard from "./ImageCard"

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
      <h3>
        Total number of NFTs You Own : {ImageNumOfAccount}
      </h3>
      <div>
        {myImages.map((image) => {
          return (
            <ImageCard
              key={image.tokenID}
              image={image}
              accountAddress={accountAddress}
              Contract={Contract}
              Auction={Auctions[parseInt(image.tokenID) - 1]}
              currentTime={currentTime}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MintedImages;