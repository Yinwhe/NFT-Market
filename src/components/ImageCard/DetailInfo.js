import React from 'react';
import {
  Button, ButtonBase, Typography, TextField, Paper, Grid, styled, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

export default function DetailInfo({
  image,
  auction
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  let onBid = (image.status == 1);
  let toBeClaim = (image.status == 2);

  return (
    <div>
      <ButtonBase onClick={handleClickOpen} sx={{ width: 328, height: 256 }}>
        <Img alt="NFT Images" src={image.tokenURI} />
      </ButtonBase>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          <Typography align="center" gutterBottom variant="h4">
            Detail Info
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid item xs container direction="column">
            <Grid item>
              <Img alt="NFT Images" src={image.tokenURI} />
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h4" component="div">
                Name: {image.tokenName}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Highest Auction Price: {window.web3.utils.fromWei(`${image.highestBidPrice}`, 'ether')} ETH
                <br />
                Minted By: {image.mintedBy}
                <br />
                Owner: {image.currentOwner}
              </Typography>
            </Grid>
            {onBid || toBeClaim ?
              <Grid item>
                {onBid ?
                  <Typography variant="h4" component="div">
                    On Auction
                  </Typography>
                  : <Typography variant="h4" component="div">
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
              </Grid>
              : <div />
            }
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}