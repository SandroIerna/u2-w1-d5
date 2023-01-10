import express from "express";
import listEndpoints from "express-list-endpoints";
import filesRouter from "./api/file/index.js";
import productsRouter from "./api/products/index.js";
import { badRequest } from "./errorHandlers.js";
import cors from "cors";

const server = express();
const port = process.env.PORT;
const whitelist = [process.env.FE_DEV_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    if (whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(`Origin ${origin} is not in the whitelist`);
    }
  },
};

server.use(cors(corsOpts));
server.use(express.json());

// ******************* ENDPOINTS *********************

server.use("/products", productsRouter);
server.use("/files", filesRouter);

// ***************** ERROR HANDLERS ******************

server.use(badRequest);

server.listen(port, () => {
  console.log(port);
  console.table(listEndpoints(server));
});
