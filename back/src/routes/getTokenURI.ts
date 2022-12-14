import { Router } from "express";
import { contractAddress } from "../constants";
import web3 from "../Solidity/scripts/ReferenceObjects";

// the require is intentional here, see https://github.com/ChainSafe/web3.js/issues/3310#issuecomment-701590114
const contract = require("../Solidity/artifacts/contracts/EC721.sol/NoveltyNFT.json");

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const router = Router();

router.get("/getTokenURI/:tokenId", async (req, res) => {
  const tokenId = parseInt(req.params.tokenId);
  try {
    const result = await nftContract.methods.tokenURI([tokenId]).call();
    res.status(200).send({ status: "success", URI: result });
  } catch (err) {
    res.status(404).send({ status: "error" });
  }
});

export default router;
