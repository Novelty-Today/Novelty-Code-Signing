require("dotenv").config();
const {  PUBLIC_KEY, PRIVATE_KEY } = process.env;
const web3 = require('./ReferenceObjects')


const createTransaction = async (contractAddress, transactionData) => {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: transactionData,
  };
  return tx;
};

const signTransaction = (tx) => {
  return web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
};

const sendTransaction = (signedTx,textOutput) => {
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction, textOutput);
}

module.exports = { createTransaction, signTransaction,sendTransaction };
