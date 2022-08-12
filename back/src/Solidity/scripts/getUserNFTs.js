require("dotenv").config();
const web3 = require("./ReferenceObjects");

const contract = require("../artifacts/contracts/EC721.sol/NoveltyNFT.json");
const { contractAddress } = require("../../constants");
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const getUserNFTs = async (userAddress) => {
  const data = await nftContract.methods
    .getUserNFTs(userAddress)
    .call({ from: contractAddress });
  return data;
};

module.exports = { getUserNFTs };
