require("dotenv").config();
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const {
  web3,
  signTransaction,
  createTransaction,
  sendTransaction,
} = require("./transactionFunctions");

// NFT Contract Information
const contract = require("../artifacts/contracts/EC721.sol/MyNFT.json");
const contractAddress = "0xca0f89b4197558a816f0c57c14ef506a70a9dfdb";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(recepient, tokenURI) {

  const transactionData = nftContract.methods
    .mintNFT(recepient, tokenURI)
    .encodeABI();

  const tx = await createTransaction(contractAddress, transactionData);
  const signedTx = await signTransaction(tx);
  console.log('4',signedTx.rawTransaction)
  sendTransaction(signedTx.rawTransaction, textOutput);
  console.log('5')
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
