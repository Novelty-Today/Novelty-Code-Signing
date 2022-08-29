import { Router, Request, Response } from "express";
import jwt_decode from "jwt-decode";
import web3 from "../Solidity/scripts/ReferenceObjects";

const {
  USER_CONTRACT_ADDRESS,
} = require("../../chainlink/identity_constants.json");
const IdentityStore = require("../../chainlink/artifacts/IdentityStore.json");

export interface AddPublicAddressInput {
  signature_v: string;
  signature_r: string;
  signature_s: string;
  proof: string;
  publicAddress: string;
  jwtToken: string;
}

const router = Router();

const addIdentityStoreEntry = (
  email: string,
  proof: string,
  publicAddress: string,
  jwtToken: string,
  signature_v: string,
  signature_r: string,
  signature_s: string
) => {
  const identityStoreContract = new web3.eth.Contract(
    IdentityStore.abi,
    USER_CONTRACT_ADDRESS
  );
  identityStoreContract
};

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
      addIdentityStoreEntry(
        email,
        proof,
        publicAddress,
        jwtToken,
        signature_v,
        signature_r,
        signature_s
      );
      res.status(200).send({
        status: "success",
      });
      console.log(req.body);
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  }
);
export default router;
