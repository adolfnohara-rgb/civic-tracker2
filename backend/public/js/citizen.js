


const socket = io("http://localhost:5000");


let issues = [];


// ================= CONFIG =================
const API_BASE = "http://localhost:5000/api";

// ================= AUTH GUARD =================
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// if (!token || !user) {
//   window.location.href = "/";
// }
if (!token || !user || user.role !== "citizen") {
  window.location.replace("/");
}

// ================= GLOBAL LOCATION =================
let currentLat = null;
let currentLng = null;

// ================= GET CURRENT LOCATION =================
function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentLat = position.coords.latitude;
      currentLng = position.coords.longitude;

      console.log("📍 Location set:", currentLat, currentLng);

      document.getElementById("location").value =
        `Lat: ${currentLat}, Lng: ${currentLng}`;
    },
    () => alert("Location permission denied")
  );
}







// // ================= ADD ISSUE =================
// async function addIssue(e) {
//  e.preventDefault();
//   e.stopPropagation();

//   const title = document.getElementById("title").value.trim();
//   const description = document.getElementById("description").value.trim();
//   const category = document.getElementById("category").value;
//   const priority = document.getElementById("priority").value;

//   if (!title || !description || !category || !priority) {
//     alert("Please fill all required fields");
//     return;
//   }

//   if (!currentLat || !currentLng) {
//     alert("Please click 'Use Current Location'");
//     return;
//   }

//   const issueData = {
//     title,
//     description,
//     category,
//     priority,
//     location: {
//       latitude: currentLat,
//       longitude: currentLng
//     }
//   };

//   try {
//     const res = await fetch(`${API_BASE}/issues`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(issueData)
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       alert(err.message || "Failed to submit issue");
//       return;
//     }

//     clearForm();
//     alert("✅ Issue reported successfully");

//   } catch (err) {
//     alert("Server error");
//   }
// }


// function addIssue() {
// function showToast(message, type = "info") {
//   alert(message); // simple & safe for now
// }


//   console.log("✅ Submit clicked");

//   const title = document.getElementById("title").value.trim();
//   const location = document.getElementById("location").value.trim();
//   const description = document.getElementById("description").value.trim();
//   const category = document.getElementById("category").value;
//   const priority = document.getElementById("priority").value;

//   if (!title || !location || !description || !category) {
//     showToast("Please fill all required fields", "error");
//     return;
//   }

//   // TEMP: frontend-only success
//   showToast("Issue submitted successfully!", "success");
// }


//REPLACE addIssue() with REAL API CALL
async function addIssue() {
  console.log("✅ Submit clicked");

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;

  if (!title || !description || !category || !priority) {
    alert("Please fill all required fields");
    return;
  }

   if (currentLat === null || currentLng === null) {
    alert("Location missing");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
  title,
  description,
  category,
  priority,
  location: {
    latitude: currentLat,
    longitude: currentLng
  }
})

    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to submit issue");
      return;
    }

    alert("✅ Issue submitted successfully");
    clearForm();
    await loadMyIssues(); // 🔥 refresh list


  } catch (err) {
    alert("Server error");
  }
}







// ================= CLEAR FORM =================
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("location").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
  document.getElementById("priority").value = "Medium";

  currentLat = null;
  currentLng = null;
}






// ================= LOGOUT =================
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/");
    });
  }
});



async function loadMyIssues() {
  try {
    const res = await fetch("http://localhost:5000/api/issues/my", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    issues = data;   // global issues array
    renderIssues(issues);

    
    renderIssues(issues);
    updateCounts(issues);



  } catch (err) {
    console.error("Failed to load issues", err);
  }
}



// document.addEventListener("DOMContentLoaded", () => {
//   const submitBtn = document.getElementById("submitBtn");
//   const clearBtn = document.getElementById("clearBtn");

//   submitBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log("🔥 Submit clicked");
//     addIssue();
//   });

//   clearBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log("🧹 Clear clicked");
//     clearForm();
//   });
// });


document.addEventListener("DOMContentLoaded", loadMyIssues);


document.getElementById("submitBtn").addEventListener("click", (e) => {
  e.preventDefault();
  addIssue();
});






// //update real time issues usig socket in citien page 
// socket.on("issue-updated", (updatedIssue) => {
//   const index = issues.findIndex(i => i._id === updatedIssue._id);
//   if (index !== -1) {
//     issues[index] = updatedIssue;
//     renderIssues();
//   }
// });











//working on citizen page

// // Update Community Issues count
// function updateIssueCount() {
//   document.getElementById("issueCount").textContent = issues.length;
// }



// function updateQuickStats() {
//   document.getElementById("totalIssues").textContent = issues.length;
//   document.getElementById("resolvedIssues").textContent =
//     issues.filter(i => i.status === "Resolved").length;
//   document.getElementById("pendingIssues").textContent =
//     issues.filter(i => i.status !== "Resolved").length;
// }






// function updateTrendingIssues() {
//   const container = document.getElementById("trendingIssues");
//   container.innerHTML = "";

//   const counts = {};
//   issues.forEach(i => {
//     counts[i.category] = (counts[i.category] || 0) + 1;
//   });

//   Object.entries(counts)
//     .sort((a, b) => b[1] - a[1])
//     .forEach(([category, count]) => {
//       const div = document.createElement("div");
//       div.className = "trending-item";
//       div.innerHTML = `
//         <span>${category}</span>
//         <span class="trend-count">${count}</span>
//       `;
//       container.appendChild(div);
//     });
// }











// // async function loadMyIssues() {
// //   try {
// //     const res = await fetch(`${API_BASE}/issues/my`, {
// //       headers: { Authorization: "Bearer " + token }
// //     });

// //     issues = await res.json();
// //     renderIssues(issues);

// //     updateQuickStats();
// //     updateTrendingIssues();

// //   } catch (err) {
// //     console.error("Failed to load issues", err);
// //   }
// // }





// //uupdated socket 
// socket.on("issue-updated", (updatedIssue) => {
//   const index = issues.findIndex(i => i._id === updatedIssue._id);

//   if (index !== -1) {
//     issues[index] = updatedIssue;
//   } else {
//     issues.unshift(updatedIssue);
//   }

//     renderIssues(issues);
//   updateIssueCount();
//   updateQuickStats();
//   updateTrendingIssues();

// });







// function renderIssues(data) {
//   const issueList = document.getElementById("issueList");
//   issueList.innerHTML = "";

//   if (!data || data.length === 0) {
//     issueList.innerHTML = "<p style='color:#fff'>No issues reported yet.</p>";
//     updateStats([]);
//     return;
//   }

//   data.forEach(issue => {
//     const card = document.createElement("div");
//     card.className = "issue-card";

//     card.innerHTML = `
//       <div class="issue-card-header">
//         <h3>${issue.title}</h3>
//         <span class="status ${issue.status.replace(" ", "-").toLowerCase()}">
//           ${issue.status}
//         </span>
//       </div>

//       <div class="issue-location">
//         <i class="fas fa-map-marker-alt"></i>
//         ${issue.location?.latitude?.toFixed(4)}, ${issue.location?.longitude?.toFixed(4)}
//       </div>

//       <p class="issue-desc">${issue.description}</p>

//       <div class="issue-footer">
//         <span class="category">${issue.category}</span>
//         <span class="date">${new Date(issue.createdAt).toDateString()}</span>
//       </div>
//     `;

//     issueList.appendChild(card);
//   });

//   updateStats(data);
// }




// function renderIssues(list = []) {
//   const issueList = document.getElementById("issueList");
//   issueList.innerHTML = "";

//   document.getElementById("issueCount").textContent = list.length;
//   document.getElementById("totalIssues").textContent = list.length;

//   let resolved = list.filter(i => i.status === "Resolved").length;
//   let pending = list.filter(i => i.status !== "Resolved").length;

//   document.getElementById("resolvedIssues").textContent = resolved;
//   document.getElementById("pendingIssues").textContent = pending;

//   if (list.length === 0) {
//     issueList.innerHTML = `<p style="opacity:.7">No issues found</p>`;
//     return;
//   }

//   list.forEach(issue => {
//     const card = document.createElement("div");
//     card.className = "issue-card";

//     card.innerHTML = `
//   <div class="issue-card-header">
//     <h3>${issue.title}</h3>
//     <span class="status ${issue.status.toLowerCase().replace(" ", "-")}">
//       ${issue.status}
//     </span>
//   </div>

//       <div class="issue-location">
//         <i class="fas fa-map-marker-alt"></i>
//         ${issue.location?.latitude.toFixed(4)}, ${issue.location?.longitude.toFixed(4)}
//       </div>

//       <p class="issue-description">
//         ${issue.description}
//       </p>

//       <div class="issue-footer">
//         <span class="issue-category">${issue.category}</span>
//         <span class="issue-date">
//           ${new Date(issue.createdAt).toDateString()}
//         </span>
//       </div>
//     `;

//     issueList.appendChild(card);
//   });
// }

function renderIssues(list = []) {
  const issueList = document.getElementById("issueList");
  issueList.innerHTML = "";

  document.getElementById("issueCount").textContent = list.length;
  document.getElementById("totalIssues").textContent = list.length;

  let resolved = list.filter(i => i.status === "Resolved").length;
  let pending = list.filter(i => i.status !== "Resolved").length;

  document.getElementById("resolvedIssues").textContent = resolved;
  document.getElementById("pendingIssues").textContent = pending;

  if (list.length === 0) {
    issueList.innerHTML = `<p style="opacity:.7">No issues found</p>`;
    return;
  }

  list.forEach(issue => {
    const card = document.createElement("div");
    card.className = "issue-card";

    card.innerHTML = `
  <div class="issue-card-header">
    <h3>${issue.title}</h3>
    <span class="status ${issue.status.toLowerCase().replace(" ", "-")}">
      ${issue.status}
    </span>
  </div>

      <div class="issue-location">
        <i class="fas fa-map-marker-alt"></i>
        ${issue.location?.latitude.toFixed(4)}, ${issue.location?.longitude.toFixed(4)}
      </div>

      <p class="issue-description">
        ${issue.description}
      </p>

      <div class="issue-footer">
        <span class="issue-category">${issue.category}</span>
        <span class="issue-date">
          ${new Date(issue.createdAt).toDateString()}
        </span>
      </div>
    `;

    issueList.appendChild(card);
  });
}






socket.on("issue-updated", (updatedIssue) => {
  const index = issues.findIndex(i => i._id === updatedIssue._id);
  if (index !== -1) {
    issues[index] = updatedIssue;
  } else {
    issues.unshift(updatedIssue);
  }

  renderIssues(issues);
});






//filters and srch 
function applyFilters() {
  const status = document.getElementById("statusFilter").value;
  const category = document.getElementById("categoryFilter").value;
  const priority = document.getElementById("priorityFilter").value;
  const search = document.getElementById("search").value.toLowerCase();

  let filtered = issues.filter(issue => {
    const matchStatus =
      status === "All" || issue.status === status;

    const matchCategory =
      category === "All" || issue.category === category;

    const matchPriority =
      priority === "All" || issue.priority === priority;

    const matchSearch =
      issue.title.toLowerCase().includes(search) ||
      issue.description.toLowerCase().includes(search);

    return matchStatus && matchCategory && matchPriority && matchSearch;
  });

  renderIssues(filtered);
  updateCounts(filtered);
}







function renderPaginatedIssues() {
  const start = 0;
  const end = currentPage * PAGE_SIZE;
  const slice = visibleIssues.slice(start, end);

  renderIssues(slice);

  document.getElementById("loadMoreSection").style.display =
    visibleIssues.length > end ? "block" : "none";
}

function loadMoreIssues() {
  currentPage++;
  renderPaginatedIssues();
}





function renderPaginatedIssues() {
  const start = 0;
  const end = currentPage * PAGE_SIZE;
  const slice = visibleIssues.slice(start, end);

  renderIssues(slice);

  document.getElementById("loadMoreSection").style.display =
    visibleIssues.length > end ? "block" : "none";
}

function loadMoreIssues() {
  currentPage++;
  renderPaginatedIssues();
}





// ["statusFilter", "categoryFilter", "priorityFilter"].forEach(id => {
//   document.getElementById(id).addEventListener("change", applyFilters);
// });

// document.getElementById("search").addEventListener("input", applyFilters);




document.getElementById("statusFilter").addEventListener("change", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("priorityFilter").addEventListener("change", applyFilters);
document.getElementById("search").addEventListener("input", applyFilters);





// ================= VIEW TOGGLE =================
document.querySelectorAll(".view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view;
    const issueList = document.getElementById("issueList");

    document.querySelectorAll(".view-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    if (view === "grid") {
      issueList.classList.remove("list-view");
      issueList.classList.add("grid-view");
    } else {
      issueList.classList.remove("grid-view");
      issueList.classList.add("list-view");
    }
  });
});











//js logic for navbar 
// document.querySelectorAll(".nav-link").forEach(link => {
//   link.addEventListener("click", e => {
//     e.preventDefault();

//     // remove active from all links
//     document.querySelectorAll(".nav-link")
//       .forEach(l => l.classList.remove("active"));

//     // hide all sections
//     document.querySelectorAll(".page-section")
//       .forEach(sec => sec.classList.remove("active-section"));

//     // activate clicked
//     link.classList.add("active");
//     const sectionId = link.dataset.section;
//     document.getElementById(sectionId).classList.add("active-section");
//   });
// });



document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    document.querySelectorAll(".nav-link")
      .forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    document.querySelectorAll(".page-section")
      .forEach(sec => sec.classList.remove("active-section"));

    const target = link.dataset.target;
    document.getElementById(target).classList.add("active-section");

    if (target === "dashboard") fetchCommunityIssues();
    if (target === "my-issues") fetchMyIssues();
  });
});









document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleFormBtn");
  const reportForm = document.getElementById("reportForm");
  const icon = toggleBtn.querySelector("i");

  toggleBtn.addEventListener("click", () => {
    reportForm.classList.toggle("closed");

    // switch arrow direction
    if (reportForm.classList.contains("closed")) {
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    } else {
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
    }
  });
});


function toggleForm() {
  const form = document.getElementById("reportForm");
  const icon = document.querySelector(".toggle-form i");

  form.classList.toggle("closed");

  if (form.classList.contains("closed")) {
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  } else {
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  }
}


async function fetchCommunityIssues() {
  const res = await fetch("http://localhost:5000/api/issues");
  const data = await res.json();
  issues = data;
  renderIssues(issues);
}


async function fetchMyIssues() {
  const res = await fetch("http://localhost:5000/api/issues/my", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });
  const data = await res.json();
  issues = data;
  renderIssues(issues);
}



document.addEventListener("DOMContentLoaded", () => {
  fetchCommunityIssues();
});
