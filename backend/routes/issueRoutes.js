const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const {
  createIssue,
  getAllIssues,
  getMyIssues,
} = require("../controllers/issueController");

router.post("/", auth, upload.single("image"),createIssue);
router.get("/", getAllIssues);
router.get("/my", auth, getMyIssues);

module.exports = router;
