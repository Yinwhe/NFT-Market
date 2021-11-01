// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ImageNFT.sol";

contract ImageAuction is ImageNFT {
    struct Auction {
        uint256 imageID;
        uint256 startBid;
        uint256 highestBid;
        address payable winner;
        uint256 endTime;
        bool ended;
        bool claimed;
    }

    mapping(uint256 => Auction) internal auctions;
    mapping(uint256 => mapping(address => uint256)) internal bidInfo;

    uint256 currentAuctionID;

    constructor() {
        currentAuctionID = 0;
    }

    modifier notOnBid(uint256 _tokenID) {
        require(!imageStorage[_tokenID].onBid, "Already on auction.");
        _;
    }

    function beginAuction(
        uint256 _tokenID,
        uint256 _minBid,
        uint256 _duration
    ) public notOnBid(_tokenID) returns (bool success) {
        updateStatus(_tokenID, true);
        updatePrice(_tokenID, _minBid);

        currentAuctionID++;
        uint256 _endTime = block.timestamp + _duration;

        Auction memory newAuction = Auction(
            _tokenID,
            _minBid,
            _minBid,
            payable(msg.sender),
            _endTime,
            false,
            false
        );

        approve(address(this), _tokenID);
        auctions[currentAuctionID] = newAuction;
        return true;
    }

    function bid(uint256 auctionID, uint256 newBid)
        public
        returns (bool success)
    {
        Auction storage auction = auctions[auctionID];
        require(!auction.ended, "Auction already ended.");
        require(newBid > auction.highestBid, "Lower bid, kidding.");

        updatePrice(auction.imageID, newBid);

        auction.winner = payable(msg.sender);
        auction.highestBid = newBid;

        bidInfo[auctionID][msg.sender] = newBid;
        return true;
    }

    function endAuction(uint256 auctionID) public returns (bool success) {
        Auction storage auction = auctions[auctionID];
        require(block.timestamp >= auction.endTime, "Not end time.");

        auction.ended = true;
        return true;
    }

    function claim(uint256 auctionID) public payable {
        Auction storage auction = auctions[auctionID];

        require(auction.ended, "Auction not ended yet.");
        require(!auction.claimed, "Auction already claimed.");
        require(auction.winner == msg.sender, "Can only be claimed by winner.");
        require(msg.value >= auction.highestBid, "ETH not enough.");

        address owner = ownerOf(auction.imageID);
        payable(owner).transfer(auction.highestBid);
        updateOwner(auction.imageID, msg.sender);
    }
}
