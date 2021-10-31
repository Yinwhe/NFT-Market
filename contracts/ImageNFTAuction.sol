// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ImageNFT.sol";

contract ImageAuction {
    ImageNFT public imageNFT;

    struct Auction {
        uint256 imageID;
        uint256 startBid;
        uint256 highestBid;
        address payable seller;
        address payable winner;
        uint256 endTime;
        bool ended;
        bool claimed;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bidInfo;

    uint256 currentAuctionID;

    constructor(ImageNFT _image) {
        imageNFT = _image;
        currentAuctionID = 0;
    }

    function beginAuction(
        uint256 _tokenID,
        uint256 _minBid,
        uint256 _duration
    ) public returns (bool success) {
        imageNFT.updateStatus(_tokenID, true);

        currentAuctionID++;
        uint256 _endTime = block.timestamp + _duration;

        Auction memory newAuction = Auction(
            _tokenID,
            _minBid,
            _minBid,
            payable(msg.sender),
            payable(msg.sender),
            _endTime,
            false,
            false
        );

        imageNFT.approve(address(this), _tokenID);
        auctions[currentAuctionID] = newAuction;
        return true;
    }

    function bid(uint256 auctionID, uint256 newBid)
        public
        returns (bool success)
    {
        Auction storage auction = auctions[auctionID];
        require(newBid > auction.highestBid);

        imageNFT.updatePrice(auction.imageID, newBid);

        auction.winner = payable(msg.sender);
        auction.highestBid = newBid;

        bidInfo[auctionID][msg.sender] = newBid;
        return true;
    }

    function endAuction(uint256 auctionID)
        public
        returns (bool success)
    {
        Auction storage auction = auctions[auctionID];
        require(block.timestamp >= auction.endTime, "Auction not yet ended.");

        auction.ended = true;
        return true;
    }

    function claim(uint256 auctionID) public {
        
    }
}