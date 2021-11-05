import React from 'react';
import {
  Button, ButtonBase, Typography, TextField, Paper, Grid, styled, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

export default function DetailInfo({
  image,
  auction,
  ownerShipTrans
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
      <ButtonBase onClick={handleClickOpen} sx={{ width: 328, height: 226 }}>
        <Img alt="NFT Images" src={image.tokenURI} />
      </ButtonBase>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
          <Grid item xs container direction="column">
            <Grid item>
              <Img alt="NFT Images" src={image.tokenURI} />
            </Grid>
            <Grid item>
              <Typography variant="h5">
                Detail Info
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Name: {image.tokenName}
                <br />
                Highest Auction Price: {window.web3.utils.fromWei(`${image.highestBidPrice}`, 'ether')} ETH
                <br />
                Minted By: {image.mintedBy}
                <br />
                Owner: {image.currentOwner}
                <br /><br />
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">
                Ownership Path
              </Typography>
              {ownerShipTrans.map((address, index) => {
                return (
                  <Typography variant="body2" color="text.secondary" key={index}>{address} -&gt;</Typography>
                );
              })}
              <Typography variant="body2" color="text.secondary">(Current)<br /><br /></Typography>
            </Grid>
            {onBid || toBeClaim ?
              <Grid item>
                {onBid ?
                  <Typography variant="h5" color="red">
                    On Auction
                  </Typography>
                  : <Typography variant="h5" color="green">
                    To Be Claimed
                  </Typography>
                }
                <Typography variant="body2" color="text.secondary">
                  Start Bid: {window.web3.utils.fromWei(`${auction.startBid}`, 'ether')} ETH
                  <br />
                  Current Bid: {window.web3.utils.fromWei(`${auction.highestBid}`, 'ether')} ETH
                  <br />
                  Current Winner: {auction.winner}
                  <br /><br />
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