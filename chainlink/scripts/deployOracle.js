const fs = require("fs");

const data = require("../constants.json");
const { LINK_NODE_ADDRESS, LINK_TOKEN_ADDRESS } = data;

async function main() {
  // 1) Deploying Oracle
  const Oracle = await ethers.getContractFactory("Operator");
  const oracle = await Oracle.deploy(
    `0x${LINK_TOKEN_ADDRESS}`,
    "0xA4faFa5523F63EE58aE7b56ad8EB5a344A19F266"
  ); // inject link token contract address
  await oracle.deployed();
  console.log("oracle deployed with address", oracle.address);
  putAddressToEnvOracle("ORACLE_ADDRESS", oracle.address);
  // 2) Connecting Oracle and Link Node
  console.log(
    "next we set oracle setFulfillmentPermission function: here we need to indicate node address"
  );
  const tx = await oracle.setAuthorizedSenders([`0x${LINK_NODE_ADDRESS}`]);
  console.log({ tx });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const putAddressToEnvOracle = (key, address) => {
  try {
    obj = {};
    obj[key] = address;
    fs.writeFileSync(
      __dirname.split("scripts")[0] + "oracle_constants.json",
      JSON.stringify(obj)
    );
  } catch (error) {
    console.log("Did not update the key ", key, error);
  }
};
