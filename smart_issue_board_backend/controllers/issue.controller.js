import { db, FieldValue } from "../src/config/firebase.js";

/**
 * CREATE ISSUE
 */
export const createIssue = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;

    if (!title || !description || !priority || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Similar Issue Detection
    const similarSnapshot = await db
      .collection("issues")
      .where("title", "==", title)
      .get();

    if (!similarSnapshot.empty) {
      return res.status(409).json({
        success: false,
        message: "Similar issue already exists",
        similarIssues: similarSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      });
    }

    const issueData = {
      title,
      description,
      priority, // Low | Medium | High
      status: "Open",
      assignedTo,
      createdBy: req.user.email,
      createdAt: FieldValue.serverTimestamp(),
    };

    const issueRef = await db.collection("issues").add(issueData);

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      issueId: issueRef.id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create issue",
    });
  }
};

/**
 * GET ALL ISSUES (FILTER + SORT)
 */
export const getAllIssues = async (req, res) => {
  try {
    const { status, priority } = req.query;

    let query = db.collection("issues");

    if (status) query = query.where("status", "==", status);
    if (priority) query = query.where("priority", "==", priority);

    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();

    const issues = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
    });
  }
};

/**
 * UPDATE ISSUE STATUS (BUSINESS RULE)
 */
export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const issueRef = db.collection("issues").doc(id);
    const issueSnap = await issueRef.get();

    if (!issueSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const currentStatus = issueSnap.data().status;

    // Rule: Open → Done not allowed
    if (currentStatus === "Open" && newStatus === "Done") {
      return res.status(400).json({
        success: false,
        message: "Please move issue to In Progress before Done",
      });
    }

    await issueRef.update({ status: newStatus });

    return res.json({
      success: true,
      message: "Issue status updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update issue status",
    });
  }
};
