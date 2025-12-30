// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authMiddleware");
// const {
//   createIssue,
//   getAllIssues,
//   getMyIssues,
// } = require("../controllers/issueController");

// router.post("/", auth, createIssue);
// router.get("/", getAllIssues);
// router.get("/my", auth, getMyIssues);

// module.exports = router;





const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createIssue,
  getAllIssues,
  getMyIssues,
} = require("../controllers/issueController");

// Create issue (logged-in citizen)
router.post("/", auth, createIssue);

// Community issues (ALL users)
router.get("/", getAllIssues);

// My issues (only logged-in user)
router.get("/my", auth, getMyIssues);

module.exports = router;
