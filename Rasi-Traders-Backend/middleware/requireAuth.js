import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import User from '../models/UserModel.js';

const requireAuth = async(req, res, next) =>{
    const {authorization} = req.headers

    if(!authorization){
        return next(new AppError("Authorization token required",401))
    }
    const token = authorization.split(' ')[1]


    try{
        const {_id}=jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findOne({_id}).select('_id')
        next();
    }catch(err){
        console.log(err)
        return next(new AppError("Unauthorized",404))
    }
}
export default requireAuth;