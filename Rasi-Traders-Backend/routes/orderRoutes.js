import express from "express"

import {tryOrder,createOrder, getOrders, cancelOrder, getAllOrders, updateOrder} from '../controllers/orderController.js'
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router
    .route('/all')
    .get(getAllOrders)
router
    .route('/:id')
    .get(getOrders)
    .patch(updateOrder)


router.use(requireAuth)

router
    .route('/')
    .post(tryOrder)

router
    .route('/create')
    .post(createOrder)


router
    .route('/cancel/:id')
    .post(cancelOrder)


export default router;