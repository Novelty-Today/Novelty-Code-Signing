import { Router, Request, Response } from "express";
import { mintNFT } from "../Solidity/scripts/mint-nft";

export interface AddSignatureInput {
	filename: string;
	signature: string;
	timestamp: string;
	userAddress: string;
}

const router = Router();

router.post(
	"/addSignature",
	async (req: Request<{}, AddSignatureInput>, res: Response) => {
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
			tokenId: Number(
				BigInt(transactionReciept.logs[0].topics[3]).toString()
			),
		});
	}
);
export default router;
