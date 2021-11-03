const ImageNFTMarketplace = artifacts.require("ImageMarketplace");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(ImageNFTMarketplace);
};
