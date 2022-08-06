import express, { json } from "express";
import cors from "cors";
import addSignature from "./routes/addSignature";
import getTokenURI from "./routes/getTokenURI";

const app = express();
app.use(json());
app.use(cors());

app.use(addSignature);
app.use(getTokenURI);

app.listen(8080, () => {
  console.log("Server is running");
});
