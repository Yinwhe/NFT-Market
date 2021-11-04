// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ImageNFT.sol";
import "./ImageNFTAuction.sol";

contract ImageMarketplace is ImageAuction {
    address internal IMAGE_NFT_MARKETPLACE;

    constructor() {
        IMAGE_NFT_MARKETPLACE = payable(address(this));
    }

    function mintImageNFT(
        string memory imageName,
        string memory ipfsHashOfPhoto
    ) external returns (bool) {
        string memory tokenURI = getTokenURI(ipfsHashOfPhoto); /// [Note]: IPFS hash + URL
        mint(msg.sender, imageName, tokenURI);
        return true;
    }

    function baseTokenURI() internal pure returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function getTokenURI(string memory _ipfsHashOfPhoto)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(baseTokenURI(), _ipfsHashOfPhoto));
    }
}
