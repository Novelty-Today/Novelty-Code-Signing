import { Router, Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { runTestFunction } from "../functions/addIdentityAlchemy";

export interface AddPublicAddressInput {
  signature_v: string;
  signature_r: string;
  signature_s: string;
  proof: string;
  publicAddress: string;
  jwtToken: string;
}

const router = Router();

router.post(
  "/addPublicAddress",
  async (req: Request<{}, AddPublicAddressInput>, res: Response) => {
    try {
      const {
        signature_v,
        signature_r,
        signature_s,
        proof,
        publicAddress,
        jwtToken,
      } = req.body;
      if (!jwtToken || !proof || !publicAddress) {
        res.status(200).send({ status: "error" });
        return;
      }
      const email: string = (jwt_decode(jwtToken) as any).email;

      await runTestFunction({
        _email: email,
        _proof:
          "0x" +
          proof
            .split("")
            .reduce(
              (prev: string, cur: string) =>
                prev + cur.charCodeAt(0).toString(16),
              ""
            ),
        _publicAddress: publicAddress,
        jwt: jwtToken,
        signature_v,
        signature_r,
        signature_s,
      });
      res.status(200).send({
        status: "success",
      });
      console.log(req.body);
    } catch (error) {
      console.log(error);
      res.status(200).send({ status: "failed" });
    }
  }
);
export default router;
