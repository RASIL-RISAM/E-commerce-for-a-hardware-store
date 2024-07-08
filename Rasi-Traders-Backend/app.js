import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
// import passport from "passport";
// import session from "express-session";



import productRouter from "./routes/productRoutes.js";
// import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import feedbackRouter from './routes/feedbackRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import errorHandler from "./controllers/errorController.js";
// import { useGoogleStrategy } from "./utils/config/passport.config.js";


dotenv.config({ path: ".env" });

const app = express();

app.use(cors());
  
app.use(express.json());
app.use(urlencoded({extended:false}))

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   saveUninitialized: true,
//   resave: false,
//   maxAge: 1000 * 60 * 15,
//   cookie:{
//       secure: true
//          }
//   }));

// app.use(passport.initialize());
// app.use(passport.session());

// useGoogleStrategy();      

// app.use("/auth/google", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRouter);

app.use("/api/v1/products", productRouter);

app.use("/api/v1/order", orderRouter);
app.use('/api/v1/feedback',feedbackRouter);

app.use('/api/v1/admin',adminRouter)


app.use(errorHandler);

export default app;
