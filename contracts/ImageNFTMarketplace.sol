// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ImageNFT.sol";
import "./ImageNFTAuction.sol";

contract ImageMarketplace is ImageAuction {
    address public IMAGE_NFT_MARKETPLACE;

    address[] public imageAddresses;

    constructor(ImageNFT _imageNFT) ImageAuction(_imageNFT) {
        IMAGE_NFT_MARKETPLACE = payable(address(this));
    }

    function mintImageNFT(
        string memory imageName,
        uint256 imagePrice,
        string memory ipfsHashOfPhoto
    ) public returns (bool) {
        string memory tokenURI = getTokenURI(ipfsHashOfPhoto); /// [Note]: IPFS hash + URL
        imageNFT.mint(imageName, tokenURI, imagePrice);
        return true;
    }

    function baseTokenURI() public pure returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function getTokenURI(string memory _ipfsHashOfPhoto)
        public
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(baseTokenURI(), _ipfsHashOfPhoto));
    }
}
