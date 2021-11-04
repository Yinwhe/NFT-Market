import React from 'react';
import { Button, Card } from '@mui/material';
import styles from '../../App.module.scss';

export default class ImageCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const image = this.props.image;
    const tokenID = this.props.key;
    return (
      <div key={tokenID}>
        <div className={styles.widgets}>

            <Card sx={{ maxWidth: 345 }}>
              <img
                alt="random unsplash image"
                src={image.tokenURI}
              />

              <span style={{ padding: "20px" }}></span>

              <p>Image Name: {image.tokenName}</p>

              <p>Highest Auction Price: {window.web3.utils.fromWei(`${image.highestBidPrice}`, 'ether')} ETH</p>

              <p>Minted By: {image.mintedBy}</p>

              <p>Owner: {image.currentOwner}</p>

              <br />

              {image.onBid == 0 ?
                <Button size={'medium'} width={1} value={image.photoNFT} onClick={this.putOnBid}> Put on sale </Button>
                :
                <Button size={'medium'} width={1} value={image.photoNFT} onClick={this.cancelOnBid}> Cancel on sale </Button>
              }

              <span style={{ padding: "5px" }}></span>
            </Card>
        </div>
      </div>
    )
  }


  ///---------------------------------------------------------
  /// Functions put a photo NFT on sale or cancel it on sale 
  ///---------------------------------------------------------
  putOnBid = async (e) => {
    // console.log('=== value of putOnBid ===', e.target.value);
    // console.log('=== IMAGE_NFT_MARKETPLACE ===', IMAGE_NFT_MARKETPLACE);

    // const IMAGE_NFT = e.target.value;

    // /// Check owner of imageID
    // const imageID = 1;  /// [Note]: imageID is always 1. Because each photoNFT is unique.
    // const owner = await imageNFT.methods.ownerOf(imageID).call();
    // console.log('=== owner of imageID ===', owner);  /// [Expect]: Owner should be the imageNFTMarketplace.sol (This also called as a proxy/escrow contract)

    // /// Put on sale (by a seller who is also called as owner)
    // const txReceipt1 = await imageNFT.methods.approve(IMAGE_NFT_MARKETPLACE, imageID).send({ from: accounts[0] });
    // const txReceipt2 = await imageNFTMarketplace.methods.openTrade(IMAGE_NFT, imageID).send({ from: accounts[0] });
    // console.log('=== response of openTrade ===', txReceipt2);
  }

  // cancelOnBid = async (e) => {
  //     const { web3, accounts, imageNFTMarketplace, imageNFT, IMAGE_NFT_MARKETPLACE } = this.state;

  //     console.log('=== value of cancelOnBid ===', e.target.value);

  //     const IMAGE_NFT = e.target.value;

  //     /// Get instance by using created photoNFT address
  //     let PhotoNFT = {};
  //     PhotoNFT = require("../../../../build/contracts/PhotoNFT.json"); 
  //     let photoNFT = new web3.eth.Contract(PhotoNFT.abi, IMAGE_NFT);

  //     /// Check owner of imageID
  //     const imageID = 1;  /// [Note]: imageID is always 1. Because each photoNFT is unique.
  //     const owner = await photoNFT.methods.ownerOf(imageID).call();
  //     console.log('=== owner of imageID ===', owner);  /// [Expect]: Owner should be the imageNFTMarketplace.sol (This also called as a proxy/escrow contract)

  //     /// Cancel on sale
  //     //const txReceipt1 = await photoNFT.methods.approve(IMAGE_NFT_MARKETPLACE, imageID).send({ from: accounts[0] });
  //     const txReceipt2 = await imageNFTMarketplace.methods.cancelTrade(IMAGE_NFT, imageID).send({ from: accounts[0] });
  //     console.log('=== response of cancelTrade ===', txReceipt2);
  // }
}
