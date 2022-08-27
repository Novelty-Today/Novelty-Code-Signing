import { Router, Request, Response } from "express";

export interface AddPublicAddressInput {
  signature: string;
  proof: string;
  publicAddress: string;
  jwtToken: string;
}

const router = Router();

router.post(
  "/addPublicAddress",
  async (req: Request<{}, AddPublicAddressInput>, res: Response) => {
    try {
      const { proof, signature, publicAddress, jwtToken } = req.body;
      if (!jwtToken || !signature || !proof || !publicAddress) {
        res.status(200).send({ status: "error" });
        return;
      }
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
