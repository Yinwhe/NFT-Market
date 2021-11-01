// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ImageNFT is ERC721URIStorage {
    struct Image {
        uint256 tokenID;
        string tokenName;
        string tokenURI;
        address payable mintedBy;
        address payable currentOwner;
        address payable previousOwner;
        uint256 highestBidPrice;
        uint256 transNum;
        bool onBid;
    }

    uint256 currentImageID;

    mapping(uint256 => Image) internal imageStorage;

    mapping(string => bool) internal tokenURIExists;

    modifier byOwner(uint256 _tokenID) {
        require(msg.sender == ownerOf(_tokenID), "Only owner can do this.");
        _;
    }

    constructor() ERC721("Image Collection", "NFT") {
        currentImageID = 0;
    }

    function mint(
        address to,
        string memory _name,
        string memory _tokenURI
    ) internal returns (uint256) {
        currentImageID++;
        require(!_exists(currentImageID), "ImageID repeated.");
        require(!tokenURIExists[_tokenURI], "Token URI repeated.");

        _safeMint(to, currentImageID);
        _setTokenURI(currentImageID, _tokenURI);

        // creat a new NFT (struct) and pass in new values
        Image memory newImage = Image(
            currentImageID,
            _name,
            _tokenURI,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            0,
            0,
            false
        );

        tokenURIExists[_tokenURI] = true;
        imageStorage[currentImageID] = newImage;

        return currentImageID;
    }

    function getImageByIndex(uint256 index)
        internal
        view
        returns (Image memory image)
    {
        require(_exists(index), "index not exist");
        return imageStorage[index];
    }

    function updateStatus(uint256 _tokenID, bool onBid)
        internal
        byOwner(_tokenID)
        returns (bool)
    {
        Image storage image = imageStorage[_tokenID];
        image.onBid = onBid;
        return true;
    }

    function updateOwner(uint256 _tokenID, address newOwner)
        internal
        byOwner(_tokenID)
        returns (bool)
    {
        Image storage image = imageStorage[_tokenID];
        image.previousOwner = image.currentOwner;
        image.currentOwner = payable(newOwner);
        image.transNum += 1;

        safeTransferFrom(ownerOf(_tokenID), newOwner, _tokenID);
        return true;
    }

    function updatePrice(uint256 _tokenID, uint256 newPrice)
        internal
        byOwner(_tokenID)
        returns (bool)
    {
        Image storage image = imageStorage[_tokenID];
        if (image.highestBidPrice < newPrice) {
            image.highestBidPrice = newPrice;
            return true;
        }
        return false;
    }
}
