import React from 'react';
import {
  Button, Typography, Grid, Box, TextField, MenuItem, Select, InputLabel,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import Loader from '../Loader';
import DetailInfo from './DetailInfo';

export default class ImageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerShipTrans: [],
      currenciesIU: 1,
      timesIU: 1,
      minBid: 0,
      duration: 0,
      newBid: 0,
      ready: false
    }
  }

  componentWillMount = async () => {
    this.setState({ ready: false });
    const image = this.props.image;
    let ownerShipTrans = [];
    for (let i = 0; i < image.transferTime; i++) {
      let address = await this.props.Contract.methods.ownerShipTrans(image.tokenID, i).call();
      ownerShipTrans.push(address);
    }
    this.setState({ ownerShipTrans: ownerShipTrans })
    this.setState({ ready: true });
  }

  render() {
    let image = this.props.image;
    let auction = this.props.Auction;
    let isOwner = (this.props.image.currentOwner === this.props.accountAddress);
    let leftTime = auction.endTime - this.props.currentTime;
    let status = image.status == 0 ? "Off Auction" : image.status == 1 ? "On Auction" : "Waitting to be Claimed";

    return (!this.state.ready ? <Loader /> :
      <Box width={800}>
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
                <Typography gutterBottom variant="h5">
                  Token ID: {image.tokenID}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <br />
                <Typography gutterBottom variant="h6" component="div">
                  Image Name: {image.tokenName}
                </Typography>
              </Grid>
              <Grid item>
                <Typography gutterBottom variant="h6" component="div">
                  Status: {status}
                </Typography>
              </Grid>
              <Grid item>
                {/* For Button */}
                {image.status == 0 ? // Hard to read I guess
                  <DPut info={this} />
                  : image.status == 1 ?
                    leftTime > 0 ?
                      isOwner ?
                        <Button>Your Auction Will End in {leftTime}s</Button>
                        : <DBid info={this} leftTime={leftTime} />
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
    let minBid = this.state.minBid * this.state.currenciesIU;
    let duration = this.state.duration * this.state.timesIU;

    /// Put on sale (by a seller who is also called as owner)
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
    let newBid = this.state.newBid * this.state.currenciesIU;

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
    console.log(auction.highestBid);
    await this.props.Contract.methods.claim(tokenID).send({ from: this.props.accountAddress, value: auction.highestBid });
    window.location.reload(true);
  }
}

function DPut({
  info
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Put On Bid
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={info.putOnBid}>
          <DialogTitle>Put On Bid</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please filling the following info to start your auction
            </DialogContentText>
            <Box>
              <TextField
                label="Starting Bid"
                type="number"
                width={100}
                variant="standard"
                required
                onChange={(e) => info.setState({ minBid: e.target.value })}
              /><br />
              <Select
                defaultValue={1}
                variant="standard"
                onChange={(e) => info.setState({ currenciesIU: e.target.value })}
              >
                <MenuItem value={1}>Wei</MenuItem>
                <MenuItem value={1000000000000}>Szabo</MenuItem>
              </Select>
            </Box>
            <Box>
              <TextField
                label="Durations"
                type="number"
                width={100}
                variant="standard"
                required
                onChange={(e) => info.setState({ duration: e.target.value })}
              /><br />
              <Select
                defaultValue={1}
                variant="standard"
                onChange={(e) => info.setState({ timesIU: e.target.value })}
              >
                <MenuItem value={1}>Second</MenuItem>
                <MenuItem value={60}>Minute</MenuItem>
                <MenuItem value={3600}>Hour</MenuItem>
              </Select>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Start</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

function DBid({
  info,
  leftTime
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Auction Ending in {leftTime}s, Bid!!!
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={info.bid}>
          <DialogTitle>Put On Bid</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please filling your bid
            </DialogContentText>
            <TextField
              label="Your Bid"
              type="number"
              width={100}
              variant="standard"
              required
              onChange={(e) => info.setState({ newBid: e.target.value })}
            /><br />
            <Select
              defaultValue={1}
              variant="standard"
              onChange={(e) => info.setState({ currenciesIU: e.target.value })}
            >
              <MenuItem value={1}>Wei</MenuItem>
              <MenuItem value={1000000000000}>Szabo</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Bid</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}