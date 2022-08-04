import express, { json, Response } from "express";
import cors from "cors";
import { CustomRequest } from "./CustomRequest";
import { spawn } from "child_process";
import { resolve } from "path";

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
		if (
			!data.filename ||
			!data.signature ||
			!data.timestamp ||
			!data.userAddress
		) {
			res.status(200).send({ status: "error" });
		}
		spawn(
			"node",
			[
				resolve(__dirname, "Solidity", "scripts", "mint-nft.js"),
				data.filename,
				data.signature,
				data.timestamp,
				data.userAddress,
			],
			{
				stdio: [process.stdin, process.stdout, process.stderr],
				cwd: resolve(__dirname, "Solidity"),
			}
		);
		res.status(200).send({ status: "success" });
	}
);
app.listen(8080);
