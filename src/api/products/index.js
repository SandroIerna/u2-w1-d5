import express from "express";
import uniqid from "uniqid";
import { getProducts, getReviews, writeProducts } from "../../lib/fs-tools.js";
import {
  checkProductSchema,
  checkReviewSchema,
  detectBadRequest,
} from "./validator.js";

const productsRouter = express.Router();

/* --------------------------- GET SINGLE --------------------------- */

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const productId = req.params.productId;
    const product = productsArray.find((product) => product._id === productId);
    res.send(product);
  } catch (error) {
    next(error);
  }
});

/* -------------------------- GET MULTIPLE -------------------------- */

productsRouter.get("/", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    if (req.query && req.query.category) {
      const filteredproducts = productsArray.filter(
        (product) => product.category === req.query.category
      );

      res.send(filteredproducts);
    } else {
      res.send(productsArray);
    }
  } catch (error) {
    next(error);
  }
});

/* ------------------------------ POST ------------------------------ */

productsRouter.post(
  "/",
  checkProductSchema,
  detectBadRequest,
  async (req, res, next) => {
    try {
      const date = new Date();
      const newProduct = {
        ...req.body,
        createdAt: date,
        updatedAt: date,
        _id: uniqid(),
        reviews: [],
      };
      const productsArray = await getProducts();
      productsArray.push(newProduct);
      writeProducts(productsArray);
      res.status(201).send({ id: newProduct._id });
    } catch (error) {
      next(error);
    }
  }
);

/* ------------------------------ PUT ------------------------------- */

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const productId = req.params.productId;
    const index = productsArray.findIndex(
      (product) => product._id === productId
    );
    const oldProduct = productsArray[index];
    const updatedProduct = {
      ...oldProduct,
      ...req.body,
      updatedAt: new Date(),
      reviews: [],
    };
    productsArray[index] = updatedProduct;
    writeProducts(productsArray);
    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});

/* ----------------------------- DELETE ----------------------------- */

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const productId = req.params.productId;
    const remainingProducts = productsArray.filter(
      (product) => product._id !== productId
    );
    writeProducts(remainingProducts);
    res.send();
  } catch (error) {
    next(error);
  }
});

/* ----------------------------- REVIEWS ---------------------------- */

/* --------------------------- GET SINGLE --------------------------- */

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const productId = req.params.productId;
    const product = productsArray.find((product) => product._id === productId);
    const reviewsArray = product.reviews;
    const reviewId = req.params.reviewId;
    const singleReview = reviewsArray.filter(
      (review) => review._id === reviewId
    );
    res.send(singleReview);
  } catch (error) {
    next(error);
  }
});

/* -------------------------- GET MULTIPLE -------------------------- */

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const productId = req.params.productId;
    const product = productsArray.find((product) => product._id === productId);
    const reviewsArray = product.reviews;
    console.log(reviewsArray);
    res.send(reviewsArray);
  } catch (error) {
    next(error);
  }
});

/* ------------------------------ POST ------------------------------ */

productsRouter.post(
  "/:productId/reviews",
  checkReviewSchema,
  detectBadRequest,
  async (req, res, next) => {
    try {
      const productsArray = await getProducts();
      const productId = req.params.productId;
      const index = productsArray.findIndex(
        (product) => product._id === productId
      );
      const product = productsArray.find(
        (product) => product._id === productId
      );
      const date = new Date();
      const newReview = {
        ...req.body,
        createdAt: date,
        updatedAt: date,
        _id: uniqid(),
        product_Id: productId,
      };
      product.reviews.push(newReview);
      productsArray[index] = product;
      writeProducts(productsArray);
      res.status(201).send("comment added");
    } catch (error) {
      next(error);
    }
  }
);

/* ------------------------------ PUT ------------------------------- */

productsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const productId = req.params.productId;
    const product = productsArray.find((product) => product._id === productId);
    const productIndex = productsArray.findIndex(
      (product) => product._id === productId
    );
    const reviewsArray = product.reviews;
    const singleReview = reviewsArray.find(
      (review) => review._id === req.params.reviewId
    );
    const reviewIndex = reviewsArray.findIndex(
      (review) => review._id === req.params.reviewId
    );
    const modifiedReview = { ...singleReview, ...req.body };
    reviewsArray[reviewIndex] = modifiedReview;
    writeProducts(productsArray);
    res.send(modifiedReview);
  } catch (error) {
    next(error);
  }
});

/* ----------------------------- DELETE ----------------------------- */

productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const productsArray = await getProducts();
      const productId = req.params.productId;
      const product = productsArray.find(
        (product) => product._id === productId
      );
      const index = productsArray.findIndex(
        (product) => product._id === productId
      );
      const reviewsArray = product.reviews;
      const reviewId = req.params.reviewId;
      const remainingReviews = reviewsArray.filter(
        (review) => review._id !== reviewId
      );
      const deletedCommentProduct = { ...product, reviews: remainingReviews };
      productsArray[index] = deletedCommentProduct;
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
