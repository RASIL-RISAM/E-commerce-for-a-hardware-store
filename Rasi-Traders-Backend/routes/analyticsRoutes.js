import express from "express"

import {feedbacksCount, customersCount, ordersCount , productsCount, ordersPerDay} from "../controllers/analyticsController.js";
const router = express.Router();

router
    .route('/orders')
    .get(ordersCount)

router
    .route('/feedbacks')
    .get(feedbacksCount)
    
router
    .route('/users')
    .get(customersCount)

router
    .route('/products')
    .get(productsCount)

router
    .route('/orders-per-day')
    .get(ordersPerDay)
    
export default router;