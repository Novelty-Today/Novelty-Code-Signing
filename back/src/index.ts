import express, { json, Response } from "express";
import cors from "cors";
import { CustomRequest, AddSignatureInput } from "./CustomRequest";
import { mintNFT } from "./Solidity/scripts/mint-nft";
import web3 from "./Solidity/scripts/ReferenceObjects";
// the require is intentional here, see https://github.com/ChainSafe/web3.js/issues/3310#issuecomment-701590114
const contract = require("./Solidity/artifacts/contracts/EC721.sol/NoveltyNFT.json");

const app = express();
app.use(json());
app.use(cors());

// NFT Contract Information
const contractAddress = "0xD240d3C19E45B9D947F1E46D89F5e67090134D09";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

app.post(
  "/addSignature",
  async (req: CustomRequest<AddSignatureInput>, res: Response) => {
    const { filename, signature, timestamp, userAddress } = req.body;
    if (!filename || !signature || !timestamp || !userAddress) {
      res.status(200).send({ status: "error" });
    }
    const transactionReciept = await mintNFT(undefined, {
      filename,
      signature,
      timestamp,
      userAddress,
    });
    res.status(200).send({
      status: "success",
      tokenId: Number(BigInt(transactionReciept.logs[0].topics[3]).toString()),
    });
  }
);

app.get("/getTokenURI/:tokenId", async (req, res) => {
  const tokenId = parseInt(req.params.tokenId);
  try {
    const result = await nftContract.methods.tokenURI([tokenId]).call();
    res.status(200).send({ status: "success", URI: result });
  } catch (err) {
    res.status(200).send({ status: "error" });
  }
});

app.listen(8080, () => {
  console.log("Server is running");
});
