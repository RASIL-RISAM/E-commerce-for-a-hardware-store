import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  userName: {
    type: String,
  },
  email: {
    type: String,
    unique:true,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
    default:null
  },
  shippingAddress: {
    street: String,
    city: String,
    zip: String,
  },
  cart: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShoppingCart'
    },
  },
  orders: {
    type:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      }],
    default:[]
  }

});

const User = mongoose.model("User", userSchema);

userSchema.pre(/^find/,  async function(next) {
  console.log('midleware exec')
  try {
     this.populate({
      path: "cart",
      model:'ShopppingCart'
    }).populate({
      path: "orders",
      model:'Order'
    });
    next();
  } catch (error) {
    next(error);
  }
});



export default User;
