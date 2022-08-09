import express, { json } from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";

import addSignature from "./routes/addSignature";
import getTokenURI from "./routes/getTokenURI";
import * as swaggerJson from "./swagger.json";

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJson));
app.use(json());
app.use(cors());

app.use(addSignature);
app.use(getTokenURI);

app.listen(8081, () => {
  console.log("Server is running");
});
