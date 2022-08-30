const Web3 = require("web3");
const {
  infuraProviderHTTPS,
  signerPublicKey,
  signerPrivateKey,
} = require("../constants");
const backConstants = require("../chainlink_external/chainlinkConstants");

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(infuraProviderHTTPS));

const createTransaction = async (transactionData) => {
  const nonce = await web3.eth.getTransactionCount(signerPublicKey, "latest"); //get latest nonce
  const tx = {
    from: signerPublicKey,
    to: backConstants?.IDENTITY_CONTRACT_ADDRESS,
    nonce,
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

const createSignSendTx = async (transactionData) => {
  const tx = await createTransaction(
    transactionData
  );
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
const identityContract = new web3.eth.Contract(
  backConstants?.IDENTITY_CONTRACT_ABI,
  backConstants?.IDENTITY_CONTRACT_ADDRESS
);

const runAddIdentityStoreEntry = async ({
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

    return await createSignSendTx(
      transactionData
    );
  } catch (Err) {}
};

module.exports = { runAddIdentityStoreEntry };
