import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is required & should be a string",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description is required & should be a string",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is required & should be a string",
    },
  },
  price: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Price is required & should be a number",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is required & should be a string",
    },
  },
};

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment is required & should be a string",
    },
  },
  rate: {
    in: ["body"],
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage:
        "Rate is mandatory field and needs to be a number and between 1 and 5!",
    },
  },
};

export const checkProductSchema = checkSchema(productSchema);
export const checkReviewSchema = checkSchema(reviewSchema);

export const detectBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Not Found", {
        errorsList: errors.array(),
      })
    );
  }
};
