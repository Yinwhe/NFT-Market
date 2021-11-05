import React from 'react';
import {Card, Box} from '@mui/material';

const Home = ({ accountAddress, accountBalance }) => {
	return (
		<div>
			<div><br />
				<h1>NFT-Market</h1>
				<p >An NFT Marketplace based on ERC721 where you can mint/sell/bid Images</p>
				<hr /><br />
				<Card><Box width={800}><br />
					<p >Account Address :</p>
					<h4>{accountAddress}</h4>
					<p>Account Balance :</p>
					<h4>{accountBalance} ETH</h4>
				<br /></Box></Card>
			</div>
		</div>
	);
};

export default Home;