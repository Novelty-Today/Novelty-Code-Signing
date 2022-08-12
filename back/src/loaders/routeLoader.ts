import addSignature from "../routes/addSignature";
import getTokenURI from "../routes/getTokenURI";
import userSignedFiles from "../routes/userSignedFIles";

export const loadRoutes = (app: any) => {
  app.use(addSignature);
  app.use(getTokenURI);
  app.use(userSignedFiles);
};
