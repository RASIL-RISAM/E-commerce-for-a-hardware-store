import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
} from "../controllers/feedbackController.js";

const router = express.Router();

router
    .route("/")
    .post(createFeedback);
router
    .route("/")
    .get(getAllFeedbacks);

export default router;