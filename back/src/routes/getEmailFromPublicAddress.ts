import { Router, Request, Response } from "express";
import { runGetEmailFromPublicAddress } from "../functions/addIdentityAlchemy";

const router = Router();

router.get(
	"/getEmailFromPublicAddress/:address",
	async (req: Request, res: Response) => {
		try {
			const address: string = req.params.address;
			const result = await runGetEmailFromPublicAddress(address);
			console.log(result);
			res.status(200).send({ email: result });
		} catch (err) {
			res.status(200).send({ email: "" });
		}
	}
);

export default router;
