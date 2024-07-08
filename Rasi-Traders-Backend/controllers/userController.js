import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import AppError from "../utils/appError.js";
import crypto from 'crypto';
import redisClient from '../utils/config/redis.config.js';
import { sendOTPToEmail } from "../utils/helpers/mailer.helper.js";
import { generateToken } from "../utils/helpers/jwt.helper.js";

export const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    await redisClient.set(email, otp, { EX: 300 });
    await sendOTPToEmail(email, otp);
    res.status(200).json({
      status: "Success",
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error(err);
    return next(new AppError("Error sending OTP", 500));
  }
};

export const verifyOTP = async(req,res,next)=>{
  const {email,otp} = req.body;
  try{
    const storedOTP = await redisClient.get(email);
    if (!storedOTP) {
      return next(new AppError("OTP expired or invalid", 400));
    }
    if (storedOTP !== otp) {
      return next(new AppError("Invalid OTP", 400));
    }
    await redisClient.del(email); 
    res.status(200).json({
      status: "Success",
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.error(err);
    return next(new AppError("Error verifying OTP", 500));
  }
}

export const registerUser = async (req, res, next) => {
  const { userName, email, password, phoneNumber, shippingAddress } = req.body;

  const existingUser = await User.findOne({ email });
  if (email === existingUser) {
    return next(
      new AppError("User with the email already exists, try logging in", 401)
    );
  }
  try {

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: encryptedPassword,
      phoneNumber,
      shippingAddress,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      status: "Success",
      data: user,
      token,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error signing up", 404));
  }
};

export const loginUser = async (req, res, next) => {
  
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("No user found with that email. Try signing Up.", 404));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new AppError("Invalid password", 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      status: "successfully got the user details",
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error getting the user details", 404));
  }
};

export const updateUser = async (req, res, next) => {
  console.log('update user called')
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
      status: "successfully updated the user details",
      data: {
        data: user,
      },
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error editing the user", 404));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      status: "successfully deleted the user",
      data: null,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Some error occured", 404));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find({}).populate({path:'orders', model:'Order'}).sort({createdAt:-1})
    console.log(user)
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch user",
    });
  }
};
