const fs = require("fs");
const path = require("path");
const promptSync = require("prompt-sync");
const { exec } = require("child_process");
const { resolve } = require("path");

const prompt = promptSync();

const sh = async (cmd) => {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

// 1. Deploy Oracle smart contract.
const deployOracleSC = async () => {
  try {
    const deployOracle = await sh(`npx hardhat run ./scripts/deployOracle.js `);
    console.log("deployOracle", deployOracle);
  } catch (err) {
    console.error(err);
  }
};

// 2. insert Oracle Address into job.toml file
const insertOracleAddress = async () => {
  try {
    let data = fs.readFileSync("./oracle_constants.json", "utf8");
    let jobToml = fs.readFileSync(
      path.resolve(path.join(__dirname, "./jobOrigin.toml")),
      "utf8"
    );
    data = JSON.parse(data);
    jobToml = jobToml.replaceAll("%oracle%", data?.ORACLE_ADDRESS);
    fs.writeFileSync("./job.toml", jobToml.toString());
  } catch (err) {
    console.error(err);
  }
};

const copyJob = async () => {
  await sh("node clipboard-job.mjs");
  console.log(
    "Content of job.toml copied, please create a job in chainlink WebUI"
  );
};

const changeJobId = async () => {
  try {
    let jobId = prompt("Please, enter jobId: ");
    let data = {};
    data["JOB_ID"] = jobId.replaceAll("-", "");
    fs.writeFileSync("./jobId.json", JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

// 1. Deploy identity smart contract.
const deployIdentitySC = async () => {
  try {
    const deployIdentity = await sh(
      `npx hardhat run ./scripts/deployIdentity.js `
    );
    console.log("deployIdentity", deployIdentity);
  } catch (err) {
    console.error(err);
  }
};

const copyFiles = async () => {
  fs.copyFileSync(
    path.resolve(__dirname, "./constants.json"),
    path.resolve(__dirname, "./../back/chainlink_external/constants.json")
  );
  fs.copyFileSync(
    path.resolve(__dirname, "./identity_constants.json"),
    path.resolve(
      __dirname,
      "./../back/chainlink_external/identity_constants.json"
    )
  );
  fs.copyFileSync(
    path.resolve(
      __dirname,
      "./artifacts/contracts/IdentityStore.sol/IdentityStore.json"
    ),
    path.resolve(__dirname, "./../back/chainlink_external/IdentityStore.json")
  );
};

const automatedDeployment = async () => {
  await deployOracleSC();
  await insertOracleAddress();
  await copyJob();
  await changeJobId();
  await deployIdentitySC();
  await copyFiles();
};

automatedDeployment();
