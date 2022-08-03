require("dotenv").config();
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const {
  signTransaction,
  createTransaction,
  sendTransaction,
} = require("./transactionFunctions");
const web3 = require('./ReferenceObjects')

// NFT Contract Information
const contract = require("../artifacts/contracts/EC721.sol/MyNFT.json");
const contractAddress = "0xca0f89b4197558a816f0c57c14ef506a70a9dfdb";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);


// for tokenURI there should be a file with code
const mintNFT = async (recepient, tokenURI) => {

  const transactionData = nftContract.methods
    .mintNFT(recepient, tokenURI)
    .encodeABI();

  const tx = await createTransaction(contractAddress, transactionData);
  const signedTx = await signTransaction(tx);
  sendTransaction(signedTx, textOutput);
}

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

mintNFT(
  PUBLIC_KEY,
  "https://gateway.pinata.cloud/ipfs/QmfCs8NZE3hRfpNNrc4jovUJ74bPXqN7pmZBfEMJZojuHA"
);
