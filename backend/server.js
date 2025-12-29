// const path = require("path");

// const authMiddleware = require("./middleware/authMiddleware");



// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// const autoEscalateIssues = require("./utils/autoEscalation");

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));



// // middleware
// app.use(cors());
// app.use(express.json());

// // 9️⃣ Connect auth routes to server
// // 🔁 Update server.js
// // Add these lines above app.listen():
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);

// // 1️⃣ Connect issue routes to server
// // 🔁 Update server.js
// // Add these lines above app.listen():
// const issueRoutes = require("./routes/issueRoutes");
// app.use("/api/issues", issueRoutes);



// // 5️⃣ Connect admin routes to server
// // 🔁 Update server.j
// // Add these lines above app.listen():
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);



// //below is full Server.js Routes section 
// // // Serve frontend
// // app.use(express.static(path.join(__dirname, "public")));

// // Serve frontend
// app.use(express.static(path.join(__dirname, "public")));



// // Home
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "public.html"));
// });

// // // Citizen (PROTECTED)
// // app.get("/citizen", authMiddleware, (req, res) => {
// //   if (req.user.role !== "citizen") {
// //     return res.status(403).send("Citizen access only");
// //   }
// //   res.sendFile(path.join(__dirname, "public", "citizen.html"));
// // });

// // // Admin (PROTECTED)
// // app.get("/admin", authMiddleware, (req, res) => {
// //   if (req.user.role !== "admin") {
// //     return res.status(403).send("Admin access only");
// //   }
// //   res.sendFile(path.join(__dirname, "public", "admin.html"));
// // });
// app.get("/citizen", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "citizen.html"));
// });

// app.get("/admin", authMiddleware, (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).send("Admin access only");
//   }

//   res.sendFile(path.join(__dirname, "public", "admin.html"));
// });




 


// // // test route
// // app.get("/", (req, res) => {
// //   res.send("Backend is running 🚀");
// // });




// // mongo connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");

//     // 🔁 Run auto escalation every 6 hours
//     setInterval(autoEscalateIssues, 6 * 60 * 60 * 1000);

//     // Optional: run once immediately on startup
//     autoEscalateIssues();


//   })

  
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

// // // START SERVER (THIS IS THE KEY PART)
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });







// // 🧩 STEP 2: Setup Socket.IO in server.js
// const http = require("http");
// const { Server } = require("socket.io");

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: { origin: "*" }
// });

// io.on("connection", (socket) => {
//   console.log("🟢 Admin connected:", socket.id);
// });

// app.set("io", io);

// server.listen(5000, () => {
//   console.log("Server running on 5000");
// });









const path = require("path");

const authMiddleware = require("./middleware/authMiddleware");



const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const autoEscalateIssues = require("./utils/autoEscalation");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// middleware
app.use(cors());
app.use(express.json());

// 9️⃣ Connect auth routes to server
// 🔁 Update server.js
// Add these lines above app.listen():
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 1️⃣ Connect issue routes to server
// 🔁 Update server.js
// Add these lines above app.listen():
const issueRoutes = require("./routes/issueRoutes");
app.use("/api/issues", issueRoutes);



// 5️⃣ Connect admin routes to server
// 🔁 Update server.j
// Add these lines above app.listen():
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);



//below is full Server.js Routes section 
// // Serve frontend
// app.use(express.static(path.join(__dirname, "public")));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));



// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public.html"));
});

// // Citizen (PROTECTED)
// app.get("/citizen", authMiddleware, (req, res) => {
//   if (req.user.role !== "citizen") {
//     return res.status(403).send("Citizen access only");
//   }
//   res.sendFile(path.join(__dirname, "public", "citizen.html"));
// });

// // Admin (PROTECTED)
// app.get("/admin", authMiddleware, (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).send("Admin access only");
//   }
//   res.sendFile(path.join(__dirname, "public", "admin.html"));
// });
app.get("/citizen", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "citizen.html"));
});

app.get("/admin", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Admin access only");
  }

  res.sendFile(path.join(__dirname, "public", "admin.html"));
});




 


// // test route
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });




// mongo connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // 🔁 Run auto escalation every 6 hours
    setInterval(autoEscalateIssues, 6 * 60 * 60 * 1000);

    // Optional: run once immediately on startup
    autoEscalateIssues();


  })

  
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// // START SERVER (THIS IS THE KEY PART)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });







// 🧩 STEP 2: Setup Socket.IO in server.js
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("🟢 Admin connected:", socket.id);
});

app.set("io", io);

server.listen(5000, () => {
  console.log("Server running on 5000");
});