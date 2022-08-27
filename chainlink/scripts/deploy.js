const data = require("../constants.json");
const { LINK_NODE_ADDRESS, LINK_TOKEN_ADDRESS, JOB_ID } = data;
const fs = require("fs");

async function main() {
  // 1) Deploying Oracle
  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy(`0x${LINK_TOKEN_ADDRESS}`); // inject link token contract address
  await oracle.deployed();
  console.log("oracle deployed with address", oracle.address);
  putAddressToEnv("ORACLE_ADDRESS", oracle.address);
  // 2) Connecting Oracle and Link Node
  console.log(
    "next we set oracle setFulfillmentPermission function: here we need to indicate node address"
  );
  const tx = await oracle.setFulfillmentPermission(
    `0x${LINK_NODE_ADDRESS}`,
    true
  );
  console.log({ tx });
  // 3) Deploying User Contract
  const IdentityStore = await ethers.getContractFactory("IdentityStore");
  console.log(
    "0x" +
      JOB_ID.split("").reduce(
        (prev, cur) => prev + cur.charCodeAt(0).toString(16),
        ""
      )
  );
  const identityStore = await IdentityStore.deploy(
    `0x${LINK_TOKEN_ADDRESS}`,
    oracle.address,
    "0x" +
      JOB_ID.split("").reduce(
        (prev, cur) => prev + cur.charCodeAt(0).toString(16),
        ""
      )
  );
  await identityStore.deployed();
  console.log("identityStore deployed with address", identityStore.address);
  putAddressToEnv("USER_CONTRACT_ADDRESS", identityStore.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const putAddressToEnv = (key, address) => {
  try {
    data[key] = address;
    fs.writeFileSync(
      __dirname.split("scripts")[0] + "constants.json",
      JSON.stringify(data)
    );
  } catch (error) {
    console.log("Did not update the key ", key, error);
  }
};
