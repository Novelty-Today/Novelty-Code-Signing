import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import cors from "cors";

export const GOOGLE_AUTH_CLIENT_ID =
	"688749290501-dnfnff0toq3e5o9d26pcbt6jbth9r7mn.apps.googleusercontent.com";

const app = express();
interface VerifyJWTInput {
	id: string;
	data: {
		jwt: string;
		proof: string;
		publicAddress: string;
	};
}

app.use(cors());
app.use(express.json());

app.post(
	"/verifyJWT",
	async (req: Request<{}, VerifyJWTInput>, res: Response) => {
		const oAuth2Client = new OAuth2Client();
		const ticket = await oAuth2Client.verifyIdToken({
			idToken: req.body.data.jwt,
			audience: GOOGLE_AUTH_CLIENT_ID,
		});
		let email = "";
		try {
			const payload = ticket.getPayload();
			if (payload) email = payload.email || "";
		} catch (e) {
			email = "";
		}
		if (req.body.email === email && email !== "")
			res.status(200).send({
				id: req.body.id,
				data: {
					proof: req.body.proof,
					email: email,
					publicAddress: req.body.publicAddress,
				},
			});
		else {
			res.status(200).send({
				id: req.body.id,
				data: {
					proof: "0x0000000000000000000000000000000000000000000000000000000000000000",
					email: email,
					publicAddress: "0x0000000000000000000000000000000000000000",
				},
			});
		}
	}
);

app.listen(4040, () => {
	console.log("server started! listening on 4040");
});
