import React from 'react';
import {
  Button, Card, CardContent, CardMedia, Typography, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

export default class ImageCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let image = this.props.image;
    let auction = this.props.Auction;
    // console.log("=== Test ===", image, auction);

    let onBid = (image.status == 1);
    let toBeClaim = (image.status == 2);
    let isOwner = (this.props.image.currentOwner === this.props.accountAddress);
    let leftTime = auction.endTime - this.props.currentTime;

    // console.log("=== Time ===", this.props.Auction.endTime,this.props.currentTime)

    return (
      <div>
        <CardMedia
          component="img"
          alt="random unsplash image"
          image={image.tokenURI}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Image Name: {image.tokenName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Highest Auction Price: {window.web3.utils.fromWei(`${image.highestBidPrice}`, 'ether')} ETH
            <br />
            Minted By: {image.mintedBy}
            <br />
            Owner: {image.currentOwner}
          </Typography>
        </CardContent>
        {onBid || toBeClaim ?
          // Bid Info here
          <div>
            {onBid ?
              <Typography gutterBottom variant="h5" component="div">
                On Auction
              </Typography>
              : <Typography gutterBottom variant="h5" component="div">
                To Be Claimed
              </Typography>
            }
            <Typography variant="body2" color="text.secondary">
              Start Bid: {window.web3.utils.fromWei(`${auction.startBid}`, 'ether')} ETH
              <br />
              Current Bid: {window.web3.utils.fromWei(`${auction.highestBid}`, 'ether')} ETH
              <br />
              Current Winner: {auction.winner}
            </Typography>
          </div>
          : <div />
        }
        {/* For Button */}
        {image.status == 0 ? // Hard to read I guess
          <Button onClick={this.putOnBid}> Put on Bid </Button>
          : image.status == 1 ?
            leftTime > 0 ?
              isOwner ?
                <Button>Your Auction Will End in {leftTime}s</Button>
                : <Button onClick={this.bid}>Ending in {leftTime}s, Bid Now!!!</Button>
              : isOwner ?
                <Button onClick={this.endOnBid}>You Can End It Now</Button>
                : <Button>Time Up, Waitting for owner to end it.</Button>
            : <Button onClick={this.claim}>To be claimed</Button>
        }
        <span style={{ padding: "5px" }}></span>
      </div>
    )
  }


  ///---------------------------------------------------------
  /// Functions put a photo NFT on bid or cancel it 
  ///---------------------------------------------------------
  putOnBid = async () => {
    let tokenID = this.props.tokenID;
    console.log("=== tokenID ===", tokenID);
    let minBid = prompt("Please input minBid");
    let duration = prompt("Please input duration");

    // /// Put on sale (by a seller who is also called as owner)
    await this.props.Contract.methods.beginAuction(tokenID, minBid, duration).send({ from: this.props.accountAddress });
  }

  endOnBid = async () => {
    let tokenID = this.props.tokenID;
    console.log("=== tokenID ===", tokenID);
    await this.props.Contract.methods.endAuction(tokenID).send({ from: this.props.accountAddress });
  }

  bid = async () => {
    let tokenID = this.props.tokenID;
    let auction = this.props.Auction;
    let newBid = promt("Please input your bid");

    if(newBid <= auction.highestBidPrice) {
      console.alert("Lower bid? Joking!");
      return;
    }
    await this.props.Contract.methods.bid(tokenID, newBid).send({ from: this.props.accountAddress });
  }

  claim = async () => {
    let tokenID = this.props.tokenID;
    let auction = this.props.Auction;

    if(this.props.accountAddress != auction.winner) {
      console.alert("You are not winner!");
      return;
    }

    await this.props.Contract.methods.claim(tokenID).send({ from: this.props.accountAddress });
  }
}