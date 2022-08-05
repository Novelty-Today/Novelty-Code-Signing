require("dotenv").config();
const { PUBLIC_KEY } = process.env;
const web3 = require("./ReferenceObjects");
const { getTxData, createSignSendTx } = require("./transactionFunctions");
const { uploadToIPFS } = require("./ipfsFunctions");

// NFT Contract Information
const contract = require("../artifacts/contracts/EC721.sol/NoveltyNFT.json");
const contractAddress = "0xD240d3C19E45B9D947F1E46D89F5e67090134D09"; //"0xca0f89b4197558a816f0c57c14ef506a70a9dfdb";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);


const mintNFT = async (recepient = PUBLIC_KEY, json) => {
  const tokenURI = await uploadToIPFS(json);
  const transactionData = getTxData(nftContract,'mintNFT',[recepient, tokenURI] )
  return createSignSendTx(contractAddress, transactionData);
};

module.exports = { mintNFT };
