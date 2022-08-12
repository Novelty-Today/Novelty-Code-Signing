require("dotenv").config();
const web3 = require("./ReferenceObjects");

const contract = require("../artifacts/contracts/EC721.sol/NoveltyNFT.json");
const { contractAddress } = require("../../constants");
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const getUserNFTs = async (userAddress) => {
  try {
    const data = await nftContract.methods
      .getUserNFTs(userAddress)
      .call({ from: contractAddress });
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUserNFTs };
