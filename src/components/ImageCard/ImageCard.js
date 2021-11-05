import React from 'react';
import {
  Button, Typography, Grid, Box
} from '@mui/material';
import Loader from '../Loader';
import DetailInfo from './DetailInfo';

export default class ImageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerShipTrans: [],
      ready: false
    }
  }

  componentWillMount = async() => {
    this.setState({ready: false});
    const image = this.props.image;
    let ownerShipTrans = [];
    for (let i = 0; i < image.transferTime; i++) {
      let address = await this.props.Contract.methods.ownerShipTrans(image.tokenID, i).call();
      ownerShipTrans.push(address);
    }
    this.setState({ ownerShipTrans: ownerShipTrans })
    this.setState({ready: true});
  }

  render() {
    let image = this.props.image;
    let auction = this.props.Auction;
    let isOwner = (this.props.image.currentOwner === this.props.accountAddress);
    let leftTime = auction.endTime - this.props.currentTime;
    let status = image.status == 0 ? "Off Auction" : image.status == 1 ? "On Auction" : "Waitting to be Claimed";

    return ( !this.state.ready ? <Loader /> :
      <Box width={700}>
        <Grid container spacing={2}>
          <Grid item>
            <DetailInfo
              image={image}
              auction={auction}
              ownerShipTrans={this.state.ownerShipTrans}
            />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column">
              <Grid item xs={2}>
                <br />
                <Typography gutterBottom variant="h5" component="div">
                  Image Name: {image.tokenName}
                </Typography>
              </Grid>
              <Grid item>
                <Typography gutterBottom variant="h5" component="div">
                  Status: {status}
                </Typography>
              </Grid>
              <Grid item>
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  putOnBid = async () => {
    let tokenID = this.props.tokenID;
    console.log("=== tokenID ===", tokenID);
    let minBid = prompt("Please input minBid");
    let duration = prompt("Please input duration");

    // /// Put on sale (by a seller who is also called as owner)
    await this.props.Contract.methods.beginAuction(tokenID, minBid, duration).send({ from: this.props.accountAddress });
    window.location.reload(true);
  }

  endOnBid = async () => {
    let tokenID = this.props.tokenID;
    console.log("=== tokenID ===", tokenID);

    await this.props.Contract.methods.endAuction(tokenID).send({ from: this.props.accountAddress });
    window.location.reload(true);
  }

  bid = async () => {
    let tokenID = this.props.tokenID;
    let auction = this.props.Auction;
    let newBid = prompt("Please input your bid");

    if (newBid <= auction.highestBidPrice) {
      window.alert("Lower bid? Joking!");
      return;
    }
    await this.props.Contract.methods.bid(tokenID, newBid).send({ from: this.props.accountAddress });
    window.location.reload(true);
  }

  claim = async () => {
    let tokenID = this.props.tokenID;
    let auction = this.props.Auction;

    if (this.props.accountAddress != auction.winner) {
      window.alert("You are not winner!");
      return;
    }

    await this.props.Contract.methods.claim(tokenID).send({ from: this.props.accountAddress });
    window.location.reload(true);
  }
}