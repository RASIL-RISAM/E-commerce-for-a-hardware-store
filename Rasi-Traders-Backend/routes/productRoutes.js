import express from "express"

import { getAllProducts,getProduct, addProduct, deleteProduct, updateProduct, verifyStock } from "../controllers/productController.js";
const router = express.Router();



router
    .route('/')
    .get(getAllProducts)
    .post(addProduct)

router
    .route('/:id')
    .get(getProduct)
    .delete(deleteProduct)
    .patch(updateProduct)

router
    .route('/verify-stock')
    .post(verifyStock)

export default router;