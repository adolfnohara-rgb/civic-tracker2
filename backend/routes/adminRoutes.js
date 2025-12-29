// const express = require("express");
// const router = express.Router();


// const auth = require("../middleware/authMiddleware");
// const role = require("../middleware/roleMiddleware");
// const Issue = require("../models/Issue");

// // router.patch(
// //   "/issues/:id/status",
// //   auth,
// //   role("admin"),
// //   async (req, res) => {
// //     const { status } = req.body;
// //     const issue = await Issue.findByIdAndUpdate(
// //       req.params.id,
// //       { status },
// //       { new: true }
// //     );
// //     res.json(issue);
// //   }
// // );

// // module.exports = router;

// // const { updateIssueStatus } = require("../controllers/adminController");

// router.put(
//   "/issues/:id/status",
//   auth,
//   role("admin"),   // 🔥 THIS LINE FIXES 403
//   updateIssueStatus
// );

// module.exports = router;




const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { updateIssueStatus } = require("../controllers/adminController");

router.put(
  "/issues/:id/status",
  auth,
  role("admin"),
  updateIssueStatus
);

module.exports = router;

