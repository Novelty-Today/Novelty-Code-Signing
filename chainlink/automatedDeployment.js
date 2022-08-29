const fs = require("fs");
const path = require("path");
const promptSync = require("prompt-sync");
const { exec } = require("child_process");

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
    const deployOracle = await sh(
      `npx hardhat run .\\scripts\\deployOracle.js `
    );
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
    console.log("please copy job.toml and paste it into UI to create new job");
  } catch (err) {
    console.error(err);
  }
};

const changeJobId = async () => {
  try {
    let jobId = prompt("Please, enter jobId: ");
    let data = fs.readFileSync("./jobId.json", "utf8");
    data = JSON.parse(data);
    data.JOB_ID = jobId.replaceAll("-", "");
    fs.writeFileSync("./jobId.json", JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

// 1. Deploy identity smart contract.
const deployIdentitySC = async () => {
  try {
    const deployIdentity = await sh(
      `npx hardhat run .\\scripts\\deployIdentity.js `
    );
    console.log("deployIdentity", deployIdentity);
  } catch (err) {
    console.error(err);
  }
};

const automatedDeployment = async () => {
  await deployOracleSC();
  await insertOracleAddress();
  await changeJobId();
  await deployIdentitySC();
};

automatedDeployment();
