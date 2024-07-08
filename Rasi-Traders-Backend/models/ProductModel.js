import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name of the product must not be empty"],
    trim: true,
    maxlength: [20, "a product name must be of length less than 20"],
    minlength: [5, "a product name must be of length greater than 5"],
  },
  description :{
    type: String,
  },
  price:{
    type:Number,
    required:[true, 'a product must have a price']
  },
  unit:{
    type:String,
    required:[true, 'a product must have a unit for specifying the dimensions']
  },
  quantity:{
    type: Number,
    required:[true, 'a product must have a quantity for stock management']
  },
  category:{
    type:String,
    required:[true, 'a product must belong to any category of filteration']
  },
  brand:{
    type:String,
  },
  material:{
    type:String,
  },
  dimensions:{
    type:String,
    required:[true,'a product must have dimensions']
  },
  color:{
    type:String,
    required:[true,'a product must have color']
  },
  images:{
    type: [String],
    required:[true, 'product images must be uploaded'],
  },
  slug : String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
});


const Product = mongoose.model('Product',productSchema);

export default Product;