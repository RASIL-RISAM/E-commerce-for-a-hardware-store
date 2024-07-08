import express from "express"

import {registerUser,deleteUser,updateUser,getAllUsers, loginUser, verifyOTP, sendOTP} from '../controllers/userController.js';

const router = express.Router();

router
    .route('/')
    .get(getAllUsers)

router
    .route("/verify-otp")
    .post(verifyOTP)

router
    .route("/send-otp")
    .post(sendOTP)


router
    .route('/login')
    .post(loginUser)

router
    .route('/signup')
    .post(registerUser)

router
    .route('/:id')
    .patch(updateUser)
    .delete(deleteUser)

export default router;