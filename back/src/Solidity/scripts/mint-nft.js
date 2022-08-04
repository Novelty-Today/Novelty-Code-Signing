require("dotenv").config();
const { PUBLIC_KEY } = process.env;
const {
  signTransaction,
  createTransaction,
  sendTransaction,
} = require("./transactionFunctions");
const web3 = require("./ReferenceObjects");
const { uploadToIPFS } = require("./ipfsFunctions");

// NFT Contract Information
const contract = require("../artifacts/contracts/EC721.sol/NoveltyNFT.json");
const contractAddress = "0xca0f89b4197558a816f0c57c14ef506a70a9dfdb";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

// for tokenURI there should be a file with code
const mintNFT = async (recepient = PUBLIC_KEY, json) => {
  const tokenURI = await uploadToIPFS(json);

  const transactionData = nftContract.methods
    .mintNFT(recepient, tokenURI)
    .encodeABI();

  const tx = await createTransaction(contractAddress, transactionData);
  const signedTx = await signTransaction(tx);
  return sendTransaction(signedTx, textOutput);
};

const textOutput = function (err, hash) {
  if (!err) {
    console.log(
      "The hash of your transaction is: ",
      hash,
      "\nCheck Alchemy's Mempool to view the status of your transaction!"
    );
  } else {
    console.log("Something went wrong when submitting your transaction:", err);
  }
};

const testObject  =   {
  "attributes": [
    {
      "trait_type": "Breed",
      "value": "Maltipoo"
    },
    {
      "trait_type": "Eye color",
      "value": "Mocha"
    }
  ],
  "description": "The world's most adorable and sensitive pup.",
  "image": "ipfs://QmWmvTJmJU3pozR9ZHFmQC2DNDwi2XJtf3QGyYiiagFSWb",
  "name": "Ramses"
}

module.exports = {mintNFT}
