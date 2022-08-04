import express, { json, Response } from "express";
import cors from "cors";
import { CustomRequest } from "./CustomRequest";

const app = express();
app.use(json());
app.use(cors());

export interface AddSignatureInput {
	filename: string;
	signature: string;
	timestamp: string;
	userAddress: string;
}

app.post(
	"/addSignature",
	async (req: CustomRequest<AddSignatureInput>, res: Response) => {
		const data = req.body;
		console.log(data);
		res.status(200).send({ status: "success" });
	}
);
app.listen(8080);
