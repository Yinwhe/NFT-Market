// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ImageNFT is ERC721URIStorage {
    struct Image {
        uint256 tokenID;
        string tokenName;
        string tokenURI;
        address mintedBy;
        address currentOwner;
        address previousOwner;
        uint256 price;
        uint256 transNum;
        bool onSale;
    }

    uint256 currentImageID;

    Image[] public imageStorage;

    mapping(string => bool) public tokenURIExists;

    constructor() ERC721("Image Collection", "NFT") {
        currentImageID = 0;
    }

    modifier byOwner(uint256 _tokenID) {
        require(msg.sender == ownerOf(_tokenID), "Can only be call by owner");
        _;
    }

    function mint(
        string memory _name,
        string memory _tokenURI,
        uint256 _price
    ) public {
        currentImageID++;
        require(!_exists(currentImageID));
        require(!tokenURIExists[_tokenURI]);

        _safeMint(msg.sender, currentImageID);
        _setTokenURI(currentImageID, _tokenURI);

        // creat a new NFT (struct) and pass in new values
        Image memory newImage = Image(
            currentImageID,
            _name,
            _tokenURI,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            _price,
            0,
            false
        );

        // make passed token URI as exists
        tokenURIExists[_tokenURI] = true;
        // Store the image into the disk
        imageStorage[currentImageID] = newImage;
    }

    function getImageByIndex(uint256 index)
        public
        view
        returns (Image memory image)
    {
        require(_exists(index), "index not exist");
        return imageStorage[index];
    }

    function getAllImages() public view returns (Image[] memory images) {
        return imageStorage;
    }

    function updateStatus(uint256 _tokenID, bool onSale)
        public
        byOwner(_tokenID)
        returns (bool)
    {
        Image storage image = imageStorage[_tokenID];
        image.onSale = onSale;
        return true;
    }

    function updatePrice(uint256 _tokenID, uint256 newPrice)
        public
        returns (bool)
    {
        Image storage image = imageStorage[_tokenID];
        image.price = newPrice;
        return true;
    }
}
