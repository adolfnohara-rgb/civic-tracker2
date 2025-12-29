const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Issue = require("../models/Issue");

// REGISTER (Citizen)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "citizen",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN (Citizen / Admin)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// //for real time status admin of issue in admin page 
// exports.updateIssueStatus = async (req, res) => {
//   try {
//     // only admin
//     // if (req.user.role !== "admin") {
//     //   return res.status(403).json({ message: "Admin only" });
//     // }

//     const { status } = req.body;
//     const issueId = req.params.id;

//     const issue = await Issue.findByIdAndUpdate(
//       issueId,
//       { status },
//       { new: true }
//     );

//     if (!issue) {
//       return res.status(404).json({ message: "Issue not found" });
//     }

//     // 🔥 REAL-TIME PUSH
//     const io = req.app.get("io");
//     io.emit("issue-updated", issue);

//     res.json(issue);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


//for real time status admin of issue in admin page 
// exports.updateIssueStatus = async (req, res) => {
//   try {
//     // only admin
//     // if (req.user.role !== "admin") {
//     //   return res.status(403).json({ message: "Admin only" });
//     // }

//     const { status } = req.body;
//     const issueId = req.params.id;

//     const issue = await Issue.findByIdAndUpdate(
//       issueId,
//       { status },
//       { new: true }
//     );

//     if (!issue) {
//       return res.status(404).json({ message: "Issue not found" });
//     }

//     // 🔥 REAL-TIME PUSH
//     const io = req.app.get("io");
//     io.emit("issue-updated", issue);

//     res.json(issue);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


exports.updateIssueStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { status } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const io = req.app.get("io");
    io.emit("issue-updated", issue);

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
