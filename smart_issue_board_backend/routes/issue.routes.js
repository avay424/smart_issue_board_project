import express from "express";
import {
  createIssue,
  getAllIssues,
  updateIssueStatus,
} from "../controllers/issue.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyAuth, createIssue);
router.get("/", verifyAuth, getAllIssues);
router.patch("/:id/status", verifyAuth, updateIssueStatus);

export default router;
