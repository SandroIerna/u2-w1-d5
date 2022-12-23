import express from "express";
import multer from "multer";
import {
  getProducts,
  saveProductsPicture,
  writeProducts,
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

/* ------------------------------ POST ------------------------------ */

filesRouter.post(
  "/:productId",
  multer().single("image"),
  async (req, res, next) => {
    try {
      const fileName = req.file.originalname;
      await saveProductsPicture(fileName, req.file.buffer);
      const url = "http://localhost:3001/img/products" + fileName;
      const productsArray = await getProducts();
      const index = productsArray.findIndex(
        (product) => product._id === req.params.productId
      );
      const oldProduct = productsArray[index];
      const productWithImage = { ...oldProduct, imageUrl: url };
      productsArray[index] = productWithImage;
      await writeProducts(productsArray);

      res.send("uploaded");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
