/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
const { PRIVATE_KEY, ALCHEMY_KEY } = require("./constants.json");

module.exports = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    goerli: {
      //url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      url: "https://goerli.infura.io/v3/b0006a4e470a4e9c8995bc68434726a8",
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity: {
    compilers: [{ version: "0.7.6" }, { version: "0.8.16" }],
  },
};
