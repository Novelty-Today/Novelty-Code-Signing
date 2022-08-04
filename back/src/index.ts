import express, { json, Response } from "express";
import cors from "cors";
import { CustomRequest, AddSignatureInput } from "./CustomRequest";
import { mintNFT } from "./Solidity/scripts/mint-nft";

const app = express();
app.use(json());
app.use(cors());

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

    console.log({ transactionReciept });
    res.status(200).send({ status: "success" });
  }
);

app.listen(8080, () => {
  console.log("Server is running");
});
