require("dotenv").config();
const web3 = require("./ReferenceObjects");

const contract = require("../artifacts/contracts/EC721.sol/NoveltyNFT.json");
const { contractAddress } = require("../../constants");
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const getNFTsURI = async (tokenIds) => {
  try {
    console.log("tokenIds", tokenIds);
    let userTokenIds = tokenIds;
    let result = [];
    for (let i = 0; i < userTokenIds.length; ++i) {
      result[i] = await nftContract.methods
        .tokenURI(userTokenIds[i])
        .call({ from: contractAddress });
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getNFTsURI };
