import express from "express"

import {  getCartItems , updateCart} from '../controllers/cartController.js'

const router = express.Router();

router
    .route('/:id')
    .put(updateCart)
    .get(getCartItems)

export default router;