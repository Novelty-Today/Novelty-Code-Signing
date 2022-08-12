import { Router, Request, Response } from "express";
import { mintNFT } from "../Solidity/scripts/mint-nft";

export interface AddSignatureInput {
  filename: string;
  signature: string;
  userAddress: string;
}

const router = Router();

router.post(
  "/addSignature",
  async (req: Request<{}, AddSignatureInput>, res: Response) => {
    try {
      console.log("\n\nrequest received");

      const { filename, signature, userAddress } = req.body;
      if (!filename || !signature || !userAddress) {
        res.status(200).send({ status: "error" });
      }

      const transactionReciept = await mintNFT(userAddress, {
        filename,
        signature,
        timestamp: new Date().toUTCString(),
        userAddress,
      });

      res.status(200).send({
        status: "success",
        tokenId: Number(
          BigInt(transactionReciept.logs[0].topics[3]).toString()
        ),
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  }
);
export default router;
