import express from 'express';
import { adminLogin, adminSignup } from '../controllers/adminController.js';
const router = express.Router();

router
    .route('/login')
    .post(adminLogin)

router
    .route('/signup')
    .post(adminSignup)

export default router;