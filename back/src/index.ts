import express, { json } from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";

import * as swaggerJson from "./Swagger/swagger.json";
import { loadRoutes } from "./loaders/routeLoader";

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJson));
app.use(json());
app.use(cors());

loadRoutes(app);

app.listen(8080, () => {
  console.log("Server is running");
});
