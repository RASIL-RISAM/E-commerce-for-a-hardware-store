import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
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
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    billAmount: {
      type: Number,
      required: true,
    },
    totalQuantity:{
      type:Number,
      required:true
    },
    razorpay_order_id:String,
    razorpay_payment_id:String,
    razorpay_signature:String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered","cancelled"],
      default: "pending",
    },
    shippingAddress: {
      street: String,
      city: String,
      zip: String,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, async function(next) {
  console.log('order middleware exec');
  try {
    this.populate({
      path: "user",
      model:'User'
    }).populate({
      path: "products.product",
      model:'Product'
    });
    next();
  } catch (error) {
    next(error);
  }
});


const Order = mongoose.model("Order", orderSchema);


export default Order;
