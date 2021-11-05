import React, { Component } from "react";
import { Button, Card, Box, TextField } from '@mui/material';
import {create} from 'ipfs-http-client';

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
			tokenURI: "",
			ipfsHash: "",
			buffer: null,  // Data to be sent to ipfs
		}
	}

	///--------------------------
	/// Functions of ipfsUpload
	///-------------------------- 
	captureFile = (event) => {
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

	onSubmit = async (event) => {
		event.preventDefault();
		
		let result = await ipfs.add(this.state.buffer);
		// In case of successful to upload to IPFS
		this.setState({ ipfsHash: result.path });
		console.log('=== ipfsHash ===', this.state.ipfsHash);

		let tokenURI = `https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`;
		this.setState({ tokenURI });
		console.log('=== tokenURI ===', tokenURI);

		await this.props.Contract.methods.mintImageNFT(this.state.NFTName, this.state.ipfsHash).send({ from: this.props.accountAddress });
		console.log("=== Mint ===", this.state.NFTName);
		window.location.reload(true);
	}

	render() {
		return (
			<div><br />
				<Card>
					<div className="jumbotron">
						<h2>Mint Your Image</h2>
					</div>
					<form onSubmit={this.onSubmit}>
						<Box>
							<TextField
								required
								type="text"
								value={this.state.NFTName}
								label="NFT's Name"
								sx={{ m: 3, width: '35ch' }}
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
								sx={{ m: 3, width: '35ch' }}
								onChange={this.captureFile} />
						</Box>
						<Box>
							<Button
								variant="contained"
								sx={{ m: 3, width: '35ch' }}
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
