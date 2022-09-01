import addSignature from "../routes/addSignature";
import getTokenURI from "../routes/getTokenURI";
import userSignedFiles from "../routes/userSignedFIles";
import addPublicAddress from "../routes/addPublicAddress";
import getEmailFromPublicAddress from "../routes/getEmailFromPublicAddress";

export const loadRoutes = (app: any) => {
  app.use(addSignature);
  app.use(getTokenURI);
  app.use(userSignedFiles);
  app.use(addPublicAddress);
  app.use(getEmailFromPublicAddress);
};
