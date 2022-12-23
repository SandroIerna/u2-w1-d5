import express from "express";
import listEndpoints from "express-list-endpoints";
import filesRouter from "./api/file/index.js";
import productsRouter from "./api/products/index.js";
import { badRequest } from "./errorHandlers.js";

const server = express();
const port = 3001;

server.use(express.json());

// ******************* ENDPOINTS *********************

server.use("/products", productsRouter);
server.use("/files", filesRouter);

// ***************** ERROR HANDLERS ******************

server.use(badRequest);

server.listen(port, () => {
  console.table(listEndpoints(server));
});
