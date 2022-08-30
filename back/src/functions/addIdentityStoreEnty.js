const Web3 = require("web3");
const Contract = require("web3-eth-contract");
const {
  infuraProviderHTTPS,
  signerPrivateKey,
  IdentityContractAddress,
  signerPublicKey,
} = require("../constants");
const ABI = require("./identityStoreABI");

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(infuraProviderHTTPS));

const sendTransaction = async (tx) => {
  const signPromise = await web3.eth.accounts.signTransaction(
    tx,
    signerPrivateKey
  );

  const transaction = await web3.eth.sendSignedTransaction(
    signPromise.raw || signPromise.rawTransaction
  );

  return transaction;
};

const addIdentityStoreEntryMethod = async (
  ABI,
  PUBLIC_KEY,
  {
    email,
    // proof,
    // publicAddress,
    // jwtToken,
    // signature_v,
    // signature_r,
    // signature_s,
  }
) => {
  const contract = new Contract(ABI, PUBLIC_KEY);
  contract.setProvider(infuraProviderHTTPS);
  const tx = {
    from: signerPublicKey,
    gas: 300000,
    data: contract.methods
      .addIdentityStoreEntry(
        email
        // proof,
        // publicAddress,
        // jwtToken,
        // signature_v,
        // signature_r,
        // signature_s
      )
      .encodeABI(),
  };

  return sendTransaction(tx);
};

module.exports = addIdentityStoreEntryMethod;
