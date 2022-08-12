import { Router } from "express";
import { contractAddress } from "../constants";
import { getNFTsURI } from "../Solidity/scripts/getNFTsURI";
import { getUserNFTs } from "../Solidity/scripts/getUserNFTs";
import web3 from "../Solidity/scripts/ReferenceObjects";

// the require is intentional here, see https://github.com/ChainSafe/web3.js/issues/3310#issuecomment-701590114
const contract = require("../Solidity/artifacts/contracts/EC721.sol/NoveltyNFT.json");

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const router = Router();

router.get("/userSignedFiles/:userWalletAddress", async (req, res) => {
  try {
    const userWalletAddress = req.params.userWalletAddress;
    const userTokenIds = await getUserNFTs(userWalletAddress);
    if (userTokenIds) {
      let userTokenURIs = await getNFTsURI(userTokenIds);
      res.send(userTokenURIs);
    } else res.send([]);
  } catch (err) {
    console.log(err);
    res.status(404).send({ status: "error" });
  }
});

export default router;
