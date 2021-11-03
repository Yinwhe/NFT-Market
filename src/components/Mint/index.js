import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, getGanacheAddresses } from "../../utils/getWeb3";

import { Grid } from '@material-ui/core';
import { Loader, Button, Card, Input, Heading, Table, Form, Field } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../config/webpack';

import styles from '../../App.module.scss';

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

		ipfs.files.add(this.state.buffer, (error, result) => {
			// In case of fail to upload to IPFS
			if (error) {
				console.error(error)
				return
			}

			// In case of successful to upload to IPFS
			this.setState({ ipfsHash: result[0].hash });
			console.log('=== ipfsHash ===', this.state.ipfsHash);

			this.NFTContract.methods.mintImageNFT(nftName, this.state.ipfsHash).send({ from: accounts[0] });
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
			<div className={styles.left}>
				<Grid container style={{ marginTop: 20 }}>
					<Grid item xs={10}>
						<Card width={"420px"}
							maxWidth={"420px"}
							mx={"auto"}
							my={5}
							p={20}
							borderColor={"#E8E8E8"}
						>
							<h2>Publish and Put on Sale</h2>
							<p>Please upload your photo and put on sale from here!</p>

							<Form onSubmit={this.onSubmit}>
								<Field label="Image NFT Name">
									<Input
										type="text"
										width={1}
										placeholder="Give Your NFT a Name"
										required={true}
										value={this.state.NFTName}
										onChange={(e) => this.setState({ NFTName: e.target.value })}
									/>
								</Field>

								<Field label="Upload Image to IPFS">
									<input
										type='file'
										onChange={this.captureFile}
										required={true}
									/>
								</Field>

								<Button size={'medium'} width={1} type='submit'>Upload my photo and put on sale</Button>
							</Form>
						</Card>
					</Grid>

					<Grid item xs={1}>
					</Grid>

					<Grid item xs={1}>
					</Grid>
				</Grid>
			</div>
		);
	}
}
