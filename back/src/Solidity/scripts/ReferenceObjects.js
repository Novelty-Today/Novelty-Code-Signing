const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { API_URL } = process.env;

// web3 object in order to send transactions to Etherium
const web3 = createAlchemyWeb3(API_URL);

module.exports = web3