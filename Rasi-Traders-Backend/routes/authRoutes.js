import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';

const router = express.Router();


router.get("/", passport.authenticate("google", { scope: ["profile","email"] }));

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    const token = jwt.sign(
      { user: req.user },
      process.env.JWT_SECRET || '',
      { expiresIn: "1h" },
    );
    res.cookie('jwtToken', token);
    res.redirect("http://localhost:5173/dashboard")
  }
);

router.get(
  '/logout', 
  (req, res, next) => {
    req.logout(function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  }
);

export default router;
