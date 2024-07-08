import multer from "multer";
import sharp from "sharp";
import {
  uploadFileToS3,
  deleteFileFromS3,
} from "../utils/helpers/s3.helper.js";
import AppError from "../utils/appError.js";
import Product from "../models/ProductModel.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 5 },
});

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});

    return res.status(200).json({
      status: "success",
      length: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
    });
  }
};

export const addProduct = async (req, res, next) => {
  try {
    upload.array("images")(req, res, async (error) => {
      const files = req.files;

      if (error) {
        return next(error);
      }
      if (!req.files || req.files.length === 0) {
        const noFilesError = new AppError("No files were provided", 400);
        return next(noFilesError);
      }
      const imageUrls = [];
      for (const file of files) {
        const buffer = await sharp(file.buffer)
          .resize({ width: 500, height: 500 })
          .toBuffer();
        const { originalname } = file;
        const imageUrl = await uploadFileToS3(
          buffer,
          originalname,
          `products/${req.body.name}`
        );
        imageUrls.push(imageUrl);
      }

      const product = await Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        unit: req.body.unit,
        quantity: req.body.quantity,
        category: req.body.category,
        brand: req.body.brand,
        material: req.body.material,
        dimensions: req.body.dimensions,
        color: req.body.color,
        images: imageUrls,
        slug: req.body.slug,
      });

      return res.status(201).json({
        status: "product created successfully",
        data: product,
      });
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    for (const imageUrl of product.images) {
      const substringStartIndex =
        "https://rasiproducts.s3.us-east-1.amazonaws.com/".length;
      const key = imageUrl.substring(substringStartIndex);
      await deleteFileFromS3(key);
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      status: "successfully deleted the product",
      data: null,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Some error occured", 404));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    res.status(200).json({
      status: "successfully updated the product details",
      data: {
        data: product,
      },
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error editing the product", 404));
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const data = await Product.findById(req.params.id);

    if (!data) {
      return next(new AppError("No product found with that ID", 404));
    }

    res.status(200).json({
      status: "successfully got the product details",
      data,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error getting the product", 404));
  }
};

export const verifyStock = async (req, res, next) => {
  console.log("stock verify called");
  try {
    const items = req.body.items;
    let allItemsInStock = true;

    for (const item of items) {
      const product = await Product.findById(item.itemId);
      if (!product || product.quantity < item.quantity) {
        allItemsInStock = false;
        break;
      }
    }
    if (allItemsInStock) {
      res.status(200).json({ message: "All items are in stock" });
    } else {
      return next(
        new AppError(`Insufficient stock for one or more products`, 400)
      );
    }
  } catch (err) {
    console.log(err);
  }
};
