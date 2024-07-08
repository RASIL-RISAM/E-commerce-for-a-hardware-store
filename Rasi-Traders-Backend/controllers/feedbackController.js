import Feedback from "../models/feedbackModel.js";

export const createFeedback = async (req, res, next) => {
  const { email, feedback } = req.body;
  try {
    await Feedback.create({
      email,
      feedback,
    });

    res.status(201).json({
      status: "success",
      message: "Feedback sent successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllFeedbacks = async (req, res, next) => {
  try {
    let feedbacks = await Feedback.find({});
    return res.status(200).json({
      status: "success",
      data: feedbacks,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to get feedbacks",
    });
  }
};
