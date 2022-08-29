const data = require("../constants.json");
const { LINK_NODE_ADDRESS, LINK_TOKEN_ADDRESS, JOB_ID } = data;
const oracleData = require("../oracle_constants.json");
const { ORACLE_ADDRESS } = oracleData;
const fs = require("fs");

async function main() {
  // Deploying IdentityStore Contract
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
    ORACLE_ADDRESS,
    "0x" +
      JOB_ID.split("").reduce(
        (prev, cur) => prev + cur.charCodeAt(0).toString(16),
        ""
      )
  );
  await identityStore.deployed();
  console.log("identityStore deployed with address", identityStore.address);
  putAddressToEnvIdentity("USER_CONTRACT_ADDRESS", identityStore.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const putAddressToEnvIdentity = (key, address) => {
  try {
    const obj = {};
    obj[key] = address;
    fs.writeFileSync(
      __dirname.split("scripts")[0] + "identity_constants.json",
      JSON.stringify(obj)
    );
  } catch (error) {
    console.log("Did not update the key ", key, error);
  }
};
