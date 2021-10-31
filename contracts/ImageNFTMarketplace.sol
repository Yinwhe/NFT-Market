// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ImageNFTAuction.sol";

contract ImageMarketplace is ImageAuction {
    address public IMAGE_NFT_MARKETPLACE;

    constructor(ImageNFT _imageNFT) ImageAuction(_imageNFT) {
        IMAGE_NFT_MARKETPLACE = payable(address(this));
    }
}