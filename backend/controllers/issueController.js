const Issue = require("../models/Issue");

//to predict categroy automatically we do automation i.e  then inside createIssue find try: nd in that below const{..............}   below it write const aiCategory = predictCategory(description);
const predictCategory = require("../utils/aiCategorizer");

//ai to predict priority score issue  after this in create issue function add this , AFTER this line: const aiCategory = predictCategory(description);    add below const priorityScore = calculatePriority({  description,  createdAt: new Date(),});
const calculatePriority = require("../utils/priorityAI");

//ai to dtect spam / duplicates 
const checkDuplicate = require("../utils/duplicateChecker");


// CREATE ISSUE (Citizen)
// exports.createIssue = async (req, res) => {
//   try {
//     const { title, description, category, latitude, longitude, imageUrl } =
//       req.body;

//     // 🧠 AI category prediction
//     const aiCategory = predictCategory(description);

//     // 🚫 DUPLICATE CHECK (SMART AI)
//     const duplicate = await checkDuplicate(
//       aiCategory,
//       latitude,
//       longitude
//     );

//     if (duplicate) {
//       return res.status(409).json({
//         message: "Similar issue already reported nearby",
//       });
//     }

//     // 🔥 AI priority score
//     const priorityScore = calculatePriority({
//       description,
//       createdAt: new Date(),
//     });

//     // ✅ Create issue
//     const issue = await Issue.create({
//       title,
//       description,
//       category: aiCategory,
//       imageUrl,
//       location: {
//         latitude,
//         longitude,
//       },
//       reportedBy: req.user.id,
//       priorityScore,
//     });

//     res.status(201).json(issue);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, imageUrl, location } = req.body;

    const latitude = location?.latitude;
    const longitude = location?.longitude;

    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: "Location missing" });
    }

    const aiCategory = predictCategory(description);

    // const duplicate = await checkDuplicate(aiCategory, latitude, longitude);
    // if (duplicate) {
    //   return res.status(409).json({
    //     message: "Similar issue already reported nearby",
    //   });
    // }

    const priorityScore = calculatePriority({
      description,
      createdAt: new Date(),
    });

    const issue = await Issue.create({
      title,
      description,
      category: aiCategory,
      imageUrl,
      location: { latitude, longitude },
      reportedBy: req.user.id,
      priorityScore,
    });

    const io = req.app.get("io");
    io.emit("new-issue", issue);

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






// GET ALL ISSUES (Public)
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("reportedBy", "name");

    //belore getting all issues by admin sort it by priority 
    issues.sort((a, b) => b.priorityScore - a.priorityScore);

    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MY ISSUES (Citizen)
exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user.id });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
