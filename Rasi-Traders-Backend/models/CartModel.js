import mongoose from "mongoose";

const shoppingCartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalQuantity:{
    type:Number,
    required:true,
    default:0
  },
  billAmount:{
    type:Number,
    required:true,
    default:0
  }
});

shoppingCartSchema.pre(/^find/, async function(next) {
  console.log('cart midleware exec')
  try {
     this.populate({
      path: "items.product",
      model:'Product'
    });
    next();
  } catch (error) {
    next(error);
  }
});


const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);

export default ShoppingCart;
