import React, { Component } from "react";
import { Button, Card, Box, Input, TextField } from '@mui/material';
import styles from '../../App.module.scss';
import { create } from 'ipfs-http-client';
import { display } from "@mui/system";

const ipfs = create({
	host: "ipfs.infura.io",
	port: 5001,
	protocol: "https",
});


export default class Mint extends Component {
	constructor(props) {
		super(props);
		this.state = {
			NFTName: "",
			tokenURI: '',
			buffer: null,  // Data to be sent to ipfs
		}
	}

	///--------------------------
	/// Functions of ipfsUpload 
	///-------------------------- 
	captureFile(event) {
		event.preventDefault()
		let file = event.target.files[0]
		let reader = new window.FileReader()
		// Read bufffered file
		reader.readAsArrayBuffer(file)
		// Callback
		reader.onloadend = () => {
			this.setState({ buffer: Buffer(reader.result) })
			console.log('=== buffer ===', this.state.buffer)
		}
	}

	onSubmit(event) {
		event.preventDefault()

		ipfs.add(this.state.buffer, (error, result) => {
			// In case of fail to upload to IPFS
			if (error) {
				console.error(error)
				return
			}

			// In case of successful to upload to IPFS
			this.setState({ ipfsHash: result[0].hash });
			console.log('=== ipfsHash ===', this.state.ipfsHash);

			let tokenURI = `https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`;
			this.setState({ tokenURI });
			console.log('=== tokenURI ===', tokenURI);

			// this.NFTContract.methods.mintImageNFT(this.state.NFTName, this.state.ipfsHash).send({ from: accounts[0] });
			// .once('receipt', (receipt) => {
			// 	console.log('=== receipt ===', receipt);

			// 	const PHOTO_NFT = receipt.events.PhotoNFTCreated.returnValues.photoNFT;
			// 	console.log('=== PHOTO_NFT ===', PHOTO_NFT);

			// 	/// Get instance by using created photoNFT address
			// 	let PhotoNFT = {};
			// 	PhotoNFT = require("../../../../build/contracts/PhotoNFT.json");
			// 	let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);
			// 	console.log('=== photoNFT ===', photoNFT);

			// 	/// Check owner of photoId==1
			// 	const photoId = 1;  /// [Note]: PhotoID is always 1. Because each photoNFT is unique.
			// 	photoNFT.methods.ownerOf(photoId).call().then(owner => console.log('=== owner of photoId 1 ===', owner));

			// 	/// [Note]: Promise (nested-structure) is needed for executing those methods below (Or, rewrite by async/await)
			// 	photoNFT.methods.approve(PHOTO_NFT_MARKETPLACE, photoId).send({ from: accounts[0] }).once('receipt', (receipt) => {
			// 		/// Put on sale (by a seller who is also called as owner)
			// 		photoNFTMarketplace.methods.openTradeWhenCreateNewPhotoNFT(PHOTO_NFT, photoId, photoPrice).send({ from: accounts[0] }).once('receipt', (receipt) => { })
			// 	})
			// })
		})
	}

	render() {
		return (
			<div>
				<br/><br/><br/>
				<Card>
					<br/>
					<div className="jumbotron">
						<h1 className="display-5">Mint Your NFT</h1>
					</div>
					<form onSubmit={this.onSubmit}>
						<Box>
							<TextField
								required
								type="text"
								value={this.state.NFTName}
								label="NFT's Name"
								sx={{ m: 4, width: '30ch' }}
								onChange={(e) =>
									this.setState({ NFTName: e.target.value })
								}
							/>
						</Box>
						<Box>
							<TextField
								required
								accept="image/*"
								type="file"
								sx={{ m: 4, width: '30ch' }}
								onChange={this.captureFile} />
						</Box>
						<Box>
							<Button
								variant="contained"
								sx={{ m: 1, width: '30ch' }}
								type='submit'>
								Mint It!
							</Button>
						</Box>
					</form>
				</Card>
			</div>
		);
	}
}
