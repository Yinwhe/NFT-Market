import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import Web3 from "web3"

import Loader from "./components/Loader/index"
import Header from "./components/Header/index.js";
import Footer from "./components/Footer/index.js";
import Home from "./components/Home/index"
import Mint from "./components/Mint/index.js";
import MintedImages from "./components/MintedImages/index.js";
import Marketplace from "./components/Marketplace/index.js";
import styles from './App.module.scss';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accountAddress: "",
			accountBalance: "",
			Contract: null,
			ImageCount: 0,
			Images: [],
			ImageNumOfAccount: 0,
			lastMintTime: null,
			Auctions: [],
			currentTime: null,
			ready: false
		};
	}

	setupWeb3 = async () => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			// Request account access if needed
			window.ethereum.send('eth_requestAccounts')
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			// Use Mist/MetaMask's provider.
			window.web3 = new Web3(window.web3.currentProvider);
			console.log("Injected web3 detected.");
		}
		// Fallback to localhost; use dev console port by default...
		else {
			console.alert("No web3 instance injected, using Infura/Local web3.");
		}
	}

	setupBlockchain = async () => {
		let ImageNFTMarketplace = {};
		try {
			ImageNFTMarketplace = require("./build/contracts/ImageMarketplace.json");
		} catch (e) {
			console.log(e);
		}

		try {
			// Get network provider and web3 instance.
			const web3 = window.web3;
			const accounts = await web3.eth.getAccounts();
			console.log("=== accounts ===", accounts.length);

			// Get the contract instance.
			let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]) : await web3.utils.toWei('0');
			balance = await web3.utils.fromWei(balance, 'ether');

			console.log("=== balance ===", balance);

			const networkId = await web3.eth.net.getId();
			let NFTMarketplaceInstance = null;
			let deployedNetwork = null;

			// Create instance of contracts
			if (ImageNFTMarketplace.networks) {
				deployedNetwork = ImageNFTMarketplace.networks[networkId];
				if (deployedNetwork) {
					NFTMarketplaceInstance = new web3.eth.Contract(
						ImageNFTMarketplace.abi,
						deployedNetwork.address,
					);
				}
			}

			if (NFTMarketplaceInstance) {
				const ImageCount = await NFTMarketplaceInstance.methods.currentImageCount().call();
				for (let i = 1; i <= ImageCount; i++) {
					const image = await NFTMarketplaceInstance.methods.imageStorage(i).call();
					this.setState({ Images: [...this.state.Images, image], });
					const auction = await NFTMarketplaceInstance.methods.auctions(i).call();
					this.setState({ Auctions: [...this.state.Auctions, auction], })
				}

				const ImageNumOfAccount = await NFTMarketplaceInstance.methods.getOwnedNumber(accounts[0]).call();
				this.setState({
					accountAddress: accounts[0],
					accountBalance: balance,
					Contract: NFTMarketplaceInstance,
					ImageCount: ImageCount,
					ImageNumOfAccount: ImageNumOfAccount,
				});
			}
			else {
				alert(
					'Failed to connect to a smart contact.'
				)
			}
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				'Failed to load web3, accounts, or contract. Check console for details.'
			);
			console.error(error);
		}
	}

	tick = async () => {
		if (this.state.Contract) {
			let currentTime = Date.parse(new Date()) / 1000;
			this.setState({ currentTime });
		}
	}

	componentWillMount = async () => {
		await this.setupWeb3();
		await this.setupBlockchain();
		this.setState({ ready: true })
	}

	componentDidMount = async () => {
		this.timerID = setInterval(
			() => this.tick(),
			1000
		);
	};

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	renderLoader() {
		return (
			<div className={styles.loader}>
				<Loader size="80px" color="red" />
				<h3> Loading Web3, accounts, and contract...</h3>
				<p> Unlock your metamask </p>
			</div>
		);
	}

	renderDeployCheck(instructionsKey) {
		return (
			<div className={styles.setup}>
				<div className={styles.notice}>
					Your <b> contracts are not deployed</b> in this network. Two potential reasons: <br />
					<p>
						Maybe you are in the wrong network? Point Metamask to localhost.<br />
						You contract is not deployed. Follow the instructions below.
					</p>
				</div>
			</div>
		);
	}

	renderHome = () => {
		return (
			<div className={styles.wrapper}>
				<Home
					accountAddress={this.state.accountAddress}
					accountBalance={this.state.accountBalance}
				/>
			</div>
		);
	}

	renderMint = () => {
		return (
			<div className={styles.wrapper}>
				<Mint
					accountAddress={this.state.accountAddress}
					Contract={this.state.Contract}
				/>
			</div>
		);
	}

	renderMintedImages = () => {
		return (
			<div className={styles.wrapper}>
				<MintedImages
					accountAddress={this.state.accountAddress}
					Images={this.state.Images}
					ImageNumOfAccount={this.state.ImageNumOfAccount}
					Contract={this.state.Contract}
					Auctions={this.state.Auctions}
					currentTime={this.state.currentTime}
				/>
			</div>
		);
	}

	renderMarketplace = () => {
		return (
			<div className={styles.wrapper}>
				<Marketplace
					accountAddress={this.state.accountAddress}
					Images={this.state.Images}
					Contract={this.state.Contract}
					Auctions={this.state.Auctions}
					currentTime={this.state.currentTime}
				/>
			</div>
		);
	}

	render() {
		console.log("Ready", this.ready);
		return (
			<div>
				{!this.ready ?
					<Loader />
					: (
						<HashRouter basename="/">
							<Header />
							<Route path="/" exact render={this.renderHome} />
							<Route path="/mint" exact render={this.renderMint} />
							<Route path="/minted-images" exact render={this.renderMintedImages} />
							<Route path="/marketplace" exact render={this.renderMarketplace} />
							<Footer />
						</HashRouter>
					)
				}
			</div>
		);
	}
}

export default App;
