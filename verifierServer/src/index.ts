import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import cors from "cors";

const GOOGLE_AUTH_CLIENT_ID =
  "688749290501-dnfnff0toq3e5o9d26pcbt6jbth9r7mn.apps.googleusercontent.com";

interface VerifyJWTInput {
  id: string;
  data: {
    jwt: string;
    proof: string;
    publicAddress: string;
  };
}

const app = express();

app.use(cors());
app.use(express.json());

app.post(
  "/verifyJWT",
  async (req: Request<{}, VerifyJWTInput>, res: Response) => {
    try {
      console.log("REQ_BODY:", req.body);
      const oAuth2Client = new OAuth2Client();
      const ticket = await oAuth2Client.verifyIdToken({
        idToken: req.body.data.jwt,
        audience: GOOGLE_AUTH_CLIENT_ID,
      });
      let email = "";
      try {
        const payload = ticket.getPayload();
        console.log("payload", JSON.stringify(payload));
        if (payload) email = payload.email || "";
      } catch (e) {
        email = "";
      }
      if (req.body.data.email === email && email !== "") {
        const response = {
          id: req.body.id,
          data: {
            proof: "0x" + Buffer.from(req.body.data.proof, "base64").toString('hex'),
            email: email,
            publicAddress:
              "0x" +
              Buffer.from(req.body.data.publicAddress, "base64").toString(
                "hex"
              ),
          },
        };
        console.log("response 1", response);
        res.status(200).send(response);
      } else {
        const response = {
          id: req.body.id,
          data: {
            proof:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            email: email,
            publicAddress: "0x0000000000000000000000000000000000000000",
          },
        };
        console.log("response 2", response);
        res.status(200).send(response);
      }
    } catch (Err: any) {
      console.log("[verifyJWT] - Error", Err?.message);
    }
  }
);

app.listen(4040, () => {
  console.log("server started! listening on 4040");
});
