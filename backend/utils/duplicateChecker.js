// // ✅ 4️⃣ DUPLICATE ISSUE DETECTION (SMART AI)
// // 🧠 What this means (baby version)

// // If someone reports:

// // same category

// // very near location

// // System says:

// // “This issue already exists nearby.”

// // That avoids spam.

// // 🎯 Logic we use

// // Same category

// // Latitude & longitude within ~100 meters

// // 🧩 Step 1: Create duplicate check file

// // Create:

// // backend/utils/duplicateChecker.js


// // Paste this 👇


// const Issue = require("../models/Issue");

// async function checkDuplicate(category, latitude, longitude) {
//   const nearbyIssue = await Issue.findOne({
//     category,
//     "location.latitude": {
//       $gte: latitude - 0.001,
//       $lte: latitude + 0.001,
//     },
//     "location.longitude": {
//       $gte: longitude - 0.001,
//       $lte: longitude + 0.001,
//     },
//   });

//   return nearbyIssue;
// }

// module.exports = checkDuplicate;


// // 🧩 Step 2: Use it when creating issue

// // In issueController.js
// // At the top:

// // const checkDuplicate = require("../utils/duplicateChecker");


// // Inside createIssue function, before saving:

// // const duplicate = await checkDuplicate(
// //   category,
// //   latitude,
// //   longitude
// // );

// // if (duplicate) {
// //   return res.status(409).json({
// //     message: "Similar issue already reported nearby",
// //   });
// // }


// // That’s it. 🔥




const Issue = require("../models/Issue");

// Haversine distance (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = async function checkDuplicate(category, latitude, longitude) {
  // ✅ only check recent issues (last 24 hrs)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const issues = await Issue.find({
    category,
    createdAt: { $gte: since },
  });

  for (const issue of issues) {
    if (!issue.location) continue;

    const dist = getDistance(
      latitude,
      longitude,
      issue.location.latitude,
      issue.location.longitude
    );

    // ✅ VERY STRICT threshold (100 meters)
    if (dist < 0.1) {
      console.log("🚫 Duplicate detected at", dist, "km");
      return true;
    }
  }

  return false;
};


