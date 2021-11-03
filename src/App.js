import React, { Component } from "react";
import Web3 from "web3"
import Header from "./components/Header/index.js";
import Footer from "./components/Footer/index.js";
import Home from "./components/Home/index"
import Mint from "./components/Mint/index.js";
// import MintedImages from "./components/MintedImages/index.js";
// import Marketplace from "./components/Marketplace/index.js";
import styles from './App.module.scss';
// import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accountAddress: "",
			accountBalance: "",
			NFTContract: null,
			NFTCount: 0,
			NFTs: [],
			NFTNumOfAccount: 0,
			nameIsUsed: false,
			lastMintTime: null,
			Auctions: [],
			currentTime: null,
			route: window.location.pathname.replace("/", "")
		};
	}

	tick = async () => {
		if (this.state.NFTContract) {
			let currentTime = await this.state.NFTContract.methods.getTime().call();
			this.setState({ currentTime });
		}
	}

	setupWeb3 = async () => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			// Request account access if needed
			window.ethereum.enable();
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			// Use Mist/MetaMask's provider.
			window.web3 = new Web3(window.web3.currentProvider);
			console.log("Injected web3 detected.");
		}
		// Fallback to localhost; use dev console port by default...
		else {
			const FALLBACK_WEB3_PROVIDER = process.env.REACT_APP_NETWORK || 'http://0.0.0.0:8545';
			const provider = new Web3.providers.HttpProvider(
				FALLBACK_WEB3_PROVIDER
			);
			window.web3 = new Web3(provider);
			console.log("No web3 instance injected, using Infura/Local web3.");
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
			let instanceimageNFTMarketplace = null;
			let deployedNetwork = null;

			// Create instance of contracts
			if (ImageNFTMarketplace.networks) {
				deployedNetwork = ImageNFTMarketplace.networks[networkId];
				if (deployedNetwork) {
					instanceimageNFTMarketplace = new web3.eth.Contract(
						ImageNFTMarketplace.abi,
						deployedNetwork.address,
					);
					console.log('=== instanceimageNFTMarketplace ===', instanceimageNFTMarketplace);
				}
			}

			if (instanceimageNFTMarketplace) {
				this.setState({
					accountAddress: accounts[0],
					accountBalance: balance,
					NFTContract: instanceimageNFTMarketplace,
					NFTCount: 0,
					NFTs: [],
					NFTNumOfAccount: 0,
					nameIsUsed: false,
					lastMintTime: null,
					Auctions: [],
					currentTime: null,
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

	componentWillMount = async () => {
		await this.setupWeb3();
		await this.setupBlockchain();
	}

	componentDidMount = async () => {
		// this.timerID = setInterval(
		// 	() => this.tick(),
		// 	1000
		// );
	};

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	// renderLoader() {
	// 	return (
	// 		<div className={styles.loader}>
	// 			<Loader size="80px" color="red" />
	// 			<h3> Loading Web3, accounts, and contract...</h3>
	// 			<p> Unlock your metamask </p>
	// 		</div>
	// 	);
	// }

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

	renderHome() {
		return (
			<div className={styles.wrapper}>
				<Home
					accountAddress={this.state.accountAddress}
					accountBalance={this.state.accountBalance}
				/>
			</div>
		);
	}

	renderMint() {
		return (
			<div className={styles.wrapper}>
				<Mint />
			</div>
		);
	}

	// renderMintedImages() {
	// 	return (
	// 		<div className={styles.wrapper}>
	// 			<MintedImages />
	// 		</div>
	// 	);
	// }

	// renderMarketPlace() {
	// 	return (
	// 		<div className={styles.wrapper}>
	// 			<Marketplace />
	// 		</div>
	// 	);
	// }

	render() {
		console.log("route", this.state.route);
		return (
			<div className={styles.App}>
				<Header />
				{this.state.route === '' && this.renderHome()}
				{this.state.route === 'mint' && this.renderMint()}
				{/* {this.state.route === 'minted-images' && this.renderMintedImages()}
				{this.state.route === 'marketplace' && this.renderMarketPlace()} */}
				<Footer />
			</div>
		);
	}
}

export default App;
