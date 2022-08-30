const Web3 = require("web3");
const {
  infuraProviderHTTPS,
  signerPublicKey,
  signerPrivateKey,
  IdentityContractAddress,
} = require("../constants");
const ABI = require("./identityStoreABI");

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(infuraProviderHTTPS));

const createTransaction = async (identityConractAddress, transactionData) => {
  const nonce = await web3.eth.getTransactionCount(signerPublicKey, "latest"); //get latest nonce
  const tx = {
    from: signerPublicKey,
    to: identityConractAddress,
    nonce: nonce,
    gas: 2000000,
    data: transactionData,
  };
  return tx;
};

const signTransaction = (tx) => {
  return web3.eth.accounts.signTransaction(tx, signerPrivateKey);
};

const sendTransaction = (signedTx, textOutput) => {
  return web3.eth.sendSignedTransaction(signedTx.rawTransaction, textOutput);
};

const getTxData = (contract, method, args) => {
  return contract.methods[method](...args).encodeABI();
};

const createSignSendTx = async (identityConractAddress, transactionData) => {
  const tx = await createTransaction(identityConractAddress, transactionData);
  const signedTx = await signTransaction(tx);
  return sendTransaction(signedTx, textOutput);
};
const textOutput = (err, hash) => {
  if (!err) {
    console.log("The hash of your transaction is: ", hash);
  } else {
    console.log("Something went wrong when submitting your transaction:", err);
  }
};
const identityContract = new web3.eth.Contract(ABI, IdentityContractAddress);

const runTestFunction = async ({
  _email,
  _proof,
  _publicAddress,
  jwt,
  signature_v,
  signature_r,
  signature_s,
}) => {
  try {
    const transactionData = getTxData(
      identityContract,
      "addIdentityStoreEntry",
      [
        _email,
        _proof,
        _publicAddress,
        jwt,
        signature_v,
        signature_r,
        signature_s,
      ]
    );

    return await createSignSendTx(IdentityContractAddress, transactionData);
  } catch (Err) {}
};

module.exports = { runTestFunction };
