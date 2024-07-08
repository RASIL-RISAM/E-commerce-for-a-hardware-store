import Admin from "../models/adminModel.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/helpers/jwt.helper.js";

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password, passkey } = req.body;
        const user = await Admin.findOne({ email });
    
        if (!user) {
          return next(new AppError("No user found with that email. Try signing Up.", 404));
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          return next(new AppError("Invalid password", 401));
        }
    
        if(passkey !== process.env.ADMIN_PASS_KEY){
          return next(new AppError("Invalid passkey", 403));
        }

        const token = generateToken(user._id);
    
        res.status(200).json({
          status:'success',
          message: "successfully got the user details",
          user:{
            userName : user.userName,
            email:user.email
          },
          token,
        });
      } catch (err) {
        console.log(err);
        return next(new AppError("Error getting the user details", 404));
      }
};


export const adminSignup = async (req, res, next) => {
  const { userName,email, password, passkey } = req.body;

  const existingUser = await Admin.findOne({ email });
  if (email === existingUser) {
    return next(
      new AppError("User with the email already exists, try logging in", 401)
    );
  }

  try {

    if (passkey !== process.env.ADMIN_PASS_KEY) {
      return next(new AppError( "Invalid passkey", 403 ));
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    
    const token = generateToken({userName,email});

    await Admin.create({
      userName,
      email,
      password: encryptedPassword,
    });


    res.status(201).json({
      status: "success",
      message: "Admin user created successfully",
      user:{
        userName:userName,
        email:email,
        token
      },
      token
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return next(new AppError("Error creating admin user", 500));
  }
};
