import React, { Component } from "react";
import { Button, Card, Box, TextField } from '@mui/material';

const IPFS = require('ipfs-api');
const ipfs = new IPFS({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https'
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

		await ipfs.files.add(this.state.buffer, (error, result) => {
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

			this.props.Contract.methods.mintImageNFT(this.state.NFTName, this.state.ipfsHash).send({ from: this.props.accountAddress });
			console.log("=== Mint ===", this.state.NFTName);
		})
	}

	render() {
		return (
			<div>
				<br /><br /><br />
				<Card>
					<br />
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
