const socket = io("http://localhost:5000");



let allIssues = [];
let map;
let markers = [];

let hotspotLayer;

// ================= AI HELPER FUNCTIONS =================

// Distance between two lat/lng points (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


function detectHotspots(issues) {
  const hotspots = [];
  const thresholdDistance = 0.5; // km
  const minIssues = 3;

  issues.forEach(issue => {
    const nearby = issues.filter(other => {
      const d = getDistance(
        issue.location.latitude,
        issue.location.longitude,
        other.location.latitude,
        other.location.longitude
      );
      return d <= thresholdDistance;
    });

    if (nearby.length >= minIssues) {
      // Calculate average center (cluster center)
      const avgLat =
        nearby.reduce((sum, i) => sum + i.location.latitude, 0) /
        nearby.length;

      const avgLng =
        nearby.reduce((sum, i) => sum + i.location.longitude, 0) /
        nearby.length;

      // Avoid duplicate hotspots
      const alreadyExists = hotspots.some(h =>
        getDistance(h.latitude, h.longitude, avgLat, avgLng) < 0.3
      );

      if (!alreadyExists) {
        hotspots.push({
          latitude: avgLat,
          longitude: avgLng,
          count: nearby.length,
        });
      }
    }
  });

  return hotspots;
}






// const token = localStorag
// .getItem("token");

// if (!token) {
//     window.location.href = "public.html";
// }


// TEMP mock admin data
const admin = {
    name: "Admin User",
    email: "admin@example.com"
};


const profileIcon = document.getElementById("profileIcon");
const dropdown = document.getElementById("profileDropdown");
document.getElementById("adminName").textContent = admin.name;
document.getElementById("adminEmail").textContent = admin.email;
profileIcon.textContent = admin.name.charAt(0).toUpperCase();

profileIcon.onclick = () => {
    dropdown.classList.toggle("hidden");
};

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-container")) {
        dropdown.classList.add("hidden");
    }
});


const tableBody = document.querySelector("#issuesTable tbody");



function getCategoryBadge(category) {
    const categoryColors = {
        "Road": '<span class="category-badge category-road">Road</span>',
        "Garbage": '<span class="category-badge category-garbage">Garbage</span>',
        "Water": '<span class="category-badge category-water">Water</span>',
        "Electricity": '<span class="category-badge category-electricity">Electricity</span>'
    };
    return categoryColors[category] || '<span class="category-badge category-other">Other</span>';
}

function getPriorityBadge(priority) {
    if (priority === "High") {
        return '<span class="priority-badge priority-high">High</span>';
    }
    if (priority === "Medium") {
        return '<span class="priority-badge priority-medium">Medium</span>';
    }
    if (priority === "Low") {
        return '<span class="priority-badge priority-low">Low</span>';
    }
    return '<span class="priority-badge priority-medium">Medium</span>';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function getTimeSince(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(dateString);
}

function updateIssueCount() {
    const count = allIssues.length;
    document.getElementById("issueCount").textContent = count;
}




// function getStatusBadge(status) {
//   if (status === "Pending") return `<span class="badge pending">Pending</span>`;
//   if (status === "In Progress") return `<span class="badge progress">In Progress</span>`;
//   if (status === "Resolved") return `<span class="badge resolved">Resolved</span>`;
//   return status;
// }
// function getStatusBadge(issue) {
//   let statusHTML = "";

//   // Normal status badge
//   if (issue.status === "Pending") {
//     statusHTML = `<span class="status-badge pending">Pending</span>`;
//   } else if (issue.status === "In Progress") {
//     statusHTML = `<span class="status-badge progress">In Progress</span>`;
//   } else if (issue.status === "Resolved") {
//     statusHTML = `<span class="status-badge resolved">Resolved</span>`;
//   }

//   // Hotspot indicator (extra, not replacement)
//   if (isHotspot(issue)) {
//     statusHTML += `<div class="hotspot-badge">🔥 Hotspot</div>`;
//   }

//   return statusHTML;
// }

function isHotspot(issue, allIssues) {
  const THRESHOLD_KM = 0.5;
  const MIN_ISSUES = 3;

  let count = 0;

  allIssues.forEach(other => {
    if (!other.location) return;

    const d = getDistance(
      issue.location.latitude,
      issue.location.longitude,
      other.location.latitude,
      other.location.longitude
    );

    if (d <= THRESHOLD_KM) count++;
  });

  return count >= MIN_ISSUES;
}


// function renderIssues(issues) {
//     tableBody.innerHTML = "";

//     const emptyState = document.getElementById("emptyState");

//     if (!issues || issues.length === 0) {
//         emptyState.style.display = "block";
//         return;
//     }

//     emptyState.style.display = "none";

//     issues.forEach(issue => {
//         const row = document.createElement("tr");

//         row.innerHTML = `
//             <td class="issue-id">${issue.id}</td>

//             <td class="issue-main">
//                 <div class="issue-header">
//                     <h4 class="issue-title">${issue.title}</h4>
//                     <img src="${issue.imageUrl}" alt="Issue" class="issue-thumbnail" onclick="showImageModal('${issue.imageUrl}', '${issue.title}')" onerror="this.style.display='none'">
//                 </div>
//                 <div class="issue-description">${issue.description}</div>
//                 <div class="issue-meta">
//                     ${getCategoryBadge(issue.category)}
//                     <span class="reported-time">${getTimeSince(issue.createdAt)}</span>
//                 </div>
//             </td>

//             <td class="reporter-info">
//                 <div class="reporter-name">${issue.reportedBy?.name ?? "Unknown"}</div>
//                 <div class="reporter-email">${issue.reportedBy?.email ?? ""}</div>
//             </td>

//             <td class="location-info">
//                 <div class="coordinates">${issue.location.latitude.toFixed(4)}, ${issue.location.longitude.toFixed(4)}</div>
//                 <button class="view-map-btn" onclick="openMap(${issue.location.latitude}, ${issue.location.longitude})">View Map</button>
//             </td>

//             <td>
//                 <span class="status-view" onclick="enableEdit('${issue.id}')">
//                     ${getStatusBadge(issue, allIssues)}

//                 </span>

//                 <select class="status-edit hidden" data-id="${issue.id}">
//                     <option value="Pending" ${issue.status === "Pending" ? "selected" : ""}>Pending</option>
//                     <option value="In Progress" ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
//                     <option value="Resolved" ${issue.status === "Resolved" ? "selected" : ""}>Resolved</option>
//                 </select>
//             </td>

//             <td>
//                 <button class="update-btn hidden" onclick="updateStatus('${issue.id}')">
//                     Update
//                 </button>
//                 <button class="cancel-btn hidden" onclick="cancelEdit('${issue.id}')">
//                     Cancel
//                 </button>
//             </td>
//         `;

//         tableBody.appendChild(row);
//     });
// }

function renderIssues(issues) {
  tableBody.innerHTML = "";

  const emptyState = document.getElementById("emptyState");

  if (!issues || issues.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  issues.forEach(issue => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="issue-id">${issue.id}</td>

      <td class="issue-main">
        <div class="issue-header">
          <h4 class="issue-title">${issue.title}</h4>
          <img 
            src="${issue.imageUrl || ""}" 
            alt="Issue" 
            class="issue-thumbnail"
            onclick="showImageModal('${issue.imageUrl}', '${issue.title}')"
            onerror="this.style.display='none'"
          >
        </div>

        <div class="issue-description">${issue.description}</div>

        <div class="issue-meta">
          ${getCategoryBadge(issue.category)}
          <span class="reported-time">${getTimeSince(issue.createdAt)}</span>
        </div>
      </td>

      <td class="reporter-info">
        <div class="reporter-name">${issue.reportedBy?.name ?? "Unknown"}</div>
        <div class="reporter-email">${issue.reportedBy?.email ?? ""}</div>
      </td>

      <td class="location-info">
        <div class="coordinates">
          ${issue.location.latitude.toFixed(4)}, 
          ${issue.location.longitude.toFixed(4)}
        </div>
        <button 
          class="view-map-btn"
          onclick="openMap(${issue.location.latitude}, ${issue.location.longitude})"
        >
          View Map
        </button>
      </td>

      <!-- ✅ STATUS + HOTSPOT -->
      <td>
        <span class="status-view" onclick="enableEdit('${issue.id}')">
          ${getStatusBadge(issue, allIssues)}
        </span>

        <select class="status-edit hidden" data-id="${issue.id}">
          <option value="Pending" ${issue.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="In Progress" ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Resolved" ${issue.status === "Resolved" ? "selected" : ""}>Resolved</option>
        </select>
      </td>

      <td>
        <button class="update-btn hidden" onclick="updateStatus('${issue.id}')">
          Update
        </button>
        <button class="cancel-btn hidden" onclick="cancelEdit('${issue.id}')">
          Cancel
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}






function enableEdit(issueId) {
    const row = document.querySelector(`select[data-id="${issueId}"]`).closest("tr");

    row.querySelector(".status-view").classList.add("hidden");
    row.querySelector(".status-edit").classList.remove("hidden");
    row.querySelector(".update-btn").classList.remove("hidden");
    row.querySelector(".cancel-btn").classList.remove("hidden");
}

function cancelEdit(issueId) {
    const row = document.querySelector(`select[data-id="${issueId}"]`).closest("tr");

    row.querySelector(".status-view").classList.remove("hidden");
    row.querySelector(".status-edit").classList.add("hidden");
    row.querySelector(".update-btn").classList.add("hidden");
    row.querySelector(".cancel-btn").classList.add("hidden");
}

// NOTE: Backend integration pending.
// // UI updates immediately; API call may fail until auth is connected.
// async function updateStatus(issueId) {
//     const select = document.querySelector(`select[data-id='${issueId}']`);
//     const newStatus = select.value;
//     const row = select.closest("tr");
//     const updateBtn = row.querySelector(".update-btn");
//     const cancelBtn = row.querySelector(".cancel-btn");

//     // Confirmation for resolved status
//     if (newStatus === "Resolved") {
//         if (!confirm("Mark this issue as resolved? This action will close the issue.")) {
//             return;
//         }
//     }

//     // Show loading state
//     updateBtn.textContent = "Updating...";
//     updateBtn.disabled = true;
//     cancelBtn.disabled = true;

//     // 1. Update UI immediately
//     const statusView = row.querySelector(".status-view");

// //     try {
// //         // 2. Call backend
// //         const token = localStorage.getItem("token") || "mock-token";
// //         await fetch(`http://localhost:5000/api/admin/issues/${issueId}/status`, {
// //   method: "PUT",
// //   headers: {
// //     "Content-Type": "application/json",
// //     Authorization: "Bearer " + localStorage.getItem("token"),
// //   },
// //   body: JSON.stringify({ status: newStatus }),
// // });


// //         // Success - update UI
// //         statusView.innerHTML = getStatusBadge(newStatus);
// //         statusView.classList.remove("hidden");
// //         select.classList.add("hidden");
        
// //         // Show success feedback
// //         updateBtn.textContent = "Updated!";
// //         updateBtn.style.backgroundColor = "#10b981";
        
// //         setTimeout(() => {
// //             updateBtn.classList.add("hidden");
// //             cancelBtn.classList.add("hidden");
// //             updateBtn.textContent = "Update";
// //             updateBtn.style.backgroundColor = "";
// //             updateBtn.disabled = false;
// //             cancelBtn.disabled = false;
// //         }, 1500);

// //         // Update the data in allIssues array
// //         const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
// //         if (issueIndex !== -1) {
// //             allIssues[issueIndex].status = newStatus;
// //         }

// //     } catch (err) {
// //         console.error("Backend update failed", err);
        
// //         // Show error feedback
// //         updateBtn.textContent = "Failed";
// //         updateBtn.style.backgroundColor = "#ef4444";
        
// //         setTimeout(() => {
// //             updateBtn.textContent = "Update";
// //             updateBtn.style.backgroundColor = "";
// //             updateBtn.disabled = false;
// //             cancelBtn.disabled = false;
// //         }, 2000);
// //     }


//    try {
//   const res = await fetch(`http://localhost:5000/api/admin/issues/${issueId}/status`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//     body: JSON.stringify({ status: newStatus }),
//   });

//   if (!res.ok) {
//     throw new Error("Status update failed");
//   }

//   // update local state
//   const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
//   if (issueIndex !== -1) {
//     allIssues[issueIndex].status = newStatus;
//   }

//   // 🔥 refresh UI + map
//   renderIssues(allIssues);
//   loadIssuesOnMap(allIssues);
//   updateIssueCount();

// } catch (err) {
//   console.error("Backend update failed", err);

//   updateBtn.textContent = "Failed";
//   updateBtn.style.backgroundColor = "#ef4444";

//   setTimeout(() => {
//     updateBtn.textContent = "Update";
//     updateBtn.style.backgroundColor = "";
//     updateBtn.disabled = false;
//     cancelBtn.disabled = false;
//   }, 2000);
// }

    
// }

async function updateStatus(issueId) {
  try {
    const select = document.querySelector(`select[data-id="${issueId}"]`);
    const newStatus = select.value;

    const res = await fetch(
      `http://localhost:5000/api/admin/issues/${issueId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Update failed");
    }

    const updatedIssue = await res.json();

    // 🔄 Update local state
    const index = allIssues.findIndex(i => i.id === issueId);
    if (index !== -1) {
      allIssues[index] = { ...updatedIssue, id: updatedIssue._id };
    }

    // 🔄 Re-render table + map
    renderIssues(allIssues);

  } catch (err) {
    console.error("❌ Update failed:", err.message);
    alert("❌ Failed to update status. Make sure you are logged in as admin.");
  }
}







document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "public.html";
};

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedCategory = categoryFilter.value;

    const filtered = allIssues.filter(issue => {
        const matchesSearch = 
            issue.title.toLowerCase().includes(searchText) ||
            issue.description.toLowerCase().includes(searchText) ||
            issue.reportedBy?.name.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "ALL" ||
            issue.status === selectedStatus;

        const matchesCategory =
            selectedCategory === "ALL" ||
            issue.category === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    renderIssues(filtered);
}

// Utility functions
function showImageModal(imageUrl, title) {
    // Simple image modal - you can enhance this
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${imageUrl}" alt="${title}" style="max-width: 90%; max-height: 90%;">
            <p>${title}</p>
        </div>
    `;
    document.body.appendChild(modal);
}

// function openMap(lat, lng) {
//     // Open Google Maps in new tab
//     const url = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
//     window.open(url, '_blank');
// }
function openMap(lat, lng) {
  if (!lat || !lng) return;
  window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
}



// Export functionality - updated for new schema
function exportToCSV() {
    const headers = ['ID', 'Title', 'Description', 'Category', 'Reported By', 'Email', 'Location', 'Status', 'Created At', 'Updated At'];
    const csvContent = [
        headers.join(','),
        ...allIssues.map(issue => [
            issue.id,
            `"${issue.title}"`,
            `"${issue.description}"`,
            issue.category,
            `"${issue.reportedBy?.name || 'Unknown'}"`,
            `"${issue.reportedBy?.email || ''}"`,
            `"${issue.location.latitude}, ${issue.location.longitude}"`,
            issue.status,
            `"${formatDate(issue.createdAt)}"`,
            `"${formatDate(issue.updatedAt)}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civic-issues-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}






//SOCKET REAL-TIME UPDATE (ADMIN + CITIZEN)
socket.on("issue-updated", (updatedIssue) => {
  console.log("🔄 Issue updated:", updatedIssue);

  const index = allIssues.findIndex(i => i._id === updatedIssue._id);
  if (index !== -1) {
    allIssues[index] = updatedIssue;
  }

  renderIssues(allIssues);
  updateIssueCount();
});





// loadIssues();    //remove old mock loader after emoving yhe tempissues now replace it with real api 

// Auto-refresh every 30 seconds (optional)
// setInterval(loadIssues, 30000);




// 👇👇👇👇👇BELOW IS WORKING MAP CODE
// // ================= MAP BASED VISUALIZATION =================

// // Initialize map
// const map = L.map("map").setView([12.97, 77.59], 12);
// // const map = window._map;
// // if (!map) return;



// // Map tiles
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "© OpenStreetMap contributors",
// }).addTo(map);


// setTimeout(() => {
//   map.invalidateSize();
// }, 500);

// // Marker icons
// const redIcon = new L.Icon({
//   iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
//   iconSize: [32, 32],
// });

// const yellowIcon = new L.Icon({
//   iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
//   iconSize: [32, 32],
// });

// const greenIcon = new L.Icon({
//   iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
//   iconSize: [32, 32],
// });

// // Store markers
// let markers = [];

// function addMarker(issue) {
//   if (!issue.location) return;

//   const { latitude, longitude } = issue.location;

//   let icon = redIcon;
//   if (issue.status === "In Progress") icon = yellowIcon;
//   if (issue.status === "Resolved") icon = greenIcon;

//   const marker = L.marker([latitude, longitude], { icon })
//     .addTo(map)
//     .bindPopup(`
//       <b>${issue.title}</b><br>
//       Category: ${issue.category}<br>
//       Status: ${issue.status}
//     `);

//   markers.push(marker);
// }



// let hotspotLayer = L.layerGroup().addTo(map);


// // // Load issues on map
// function loadIssuesOnMap(issues) {

//     console.log("Issues on map:", issues);
// console.log("Hotspots found:", detectHotspots(issues));


//   // clear old markers
//   markers.forEach(marker => map.removeLayer(marker));
//   markers = [];

//   // group to calculate bounds
//   const bounds = [];

//   // issues.forEach(issue => {
//   //   const { latitude, longitude } = issue.location;
//    issues.forEach(issue => {
//   if (!issue.location) return;

//   const { latitude, longitude } = issue.location;



//     let icon = redIcon;
//     if (issue.status === "In Progress") icon = yellowIcon;
//     if (issue.status === "Resolved") icon = greenIcon;

//     const marker = L.marker([latitude, longitude], { icon })
//       .addTo(map)
//       .bindPopup(`
//         <b>${issue.title}</b><br>
//         Category: ${issue.category}<br>
//         Status: ${issue.status}
//       `);

//     markers.push(marker);
//     bounds.push([latitude, longitude]);
//   });

//   // 🔥 AUTO ZOOM
//   if (bounds.length > 0) {
//     map.fitBounds(bounds, { padding: [50, 50] });
//   }

//   // 🔥 HOTSPOT VISUALIZATION (AI OUTPUT)


// const hotspots = detectHotspots(issues);

// hotspots.forEach(hotspot => {
//   L.circle(
//     [hotspot.latitude, hotspot.longitude],
//     {
//       radius: 400 + hotspot.count * 50,
//       color: "red",
//       fillColor: "#ef4444",
//       fillOpacity: 0.25,
//     }
//   )
//     .addTo(hotspotLayer)
//     .bindPopup(`🚨 ${hotspot.count} nearby issues`);
// });



// }
// 👆👆👆👆👆WORKIG MAP CODE ENEDED



// document.addEventListener("DOMContentLoaded", () => {

//   const map = L.map("map").setView([12.97, 77.59], 12);

//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "© OpenStreetMap contributors",
//   }).addTo(map);

// });




// async function fetchIssues() {
//   const res = await fetch("http://localhost:5000/api/issues");
//   const data = await res.json();

//   allIssues = data.map(i => ({ ...i, id: i._id }));
//   renderIssues(allIssues);
//   updateIssueCount();
// }

// // initial load
// fetchIssues();

// // auto refresh every 20s
// setInterval(fetchIssues, 20000);


// let map; // global map reference

// document.addEventListener("DOMContentLoaded", async () => {
//   console.log("✅ Admin loaded");

//   // ✅ 1. Create map AFTER DOM
// const map = L.map("map").setView([12.97, 77.59], 12);
// console.log("MAP CREATED:", map);


//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "© OpenStreetMap contributors",
//   }).addTo(map);

//   // ✅ INIT HOTSPOT LAYER AFTER MAP
// hotspotLayer = L.layerGroup().addTo(map);

// console.log("✅ Map & hotspotLayer ready");

//   setTimeout(() => map.invalidateSize(), 300);

//   // ✅ 2. Load issues
//   await loadAdminIssues();
// });





// async function loadAdminIssues() {
//   try {
//     const res = await fetch("http://localhost:5000/api/issues");
//     const data = await res.json();

//     allIssues = data
//       .filter(i => i.location?.latitude && i.location?.longitude)
//       .map(i => ({ ...i, id: i._id }));

//     console.log("📦 Issues:", allIssues);

//     renderIssues(allIssues);
//     updateIssueCount();
//     loadIssuesOnMap(allIssues);

//   } catch (err) {
//     console.error("❌ Admin fetch failed", err);
//   }
// }



// console.log("MAP ISSUES COUNT:", issues.length);
// console.log("FIRST ISSUE:", issues[0]);


// // function loadIssuesOnMap(issues) {
// //   if (!map) return;

// //   markers.forEach(m => map.removeLayer(m));
// //   markers = [];
// //   hotspotLayer.clearLayers();

// //   const bounds = [];

// //   // issues.forEach(issue => {
// //   //   // const { latitude, longitude } = issue.location;
// //   //   const latitude = parseFloat(issue.location.latitude);
// //   //    const longitude = parseFloat(issue.location.longitude);

// //   //    if (isNaN(latitude) || isNaN(longitude)) return;


// //   //   let icon = redIcon;
// //   //   if (issue.status === "In Progress") icon = yellowIcon;
// //   //   if (issue.status === "Resolved") icon = greenIcon;

// //   //   const marker = L.marker([latitude, longitude], { icon })
// //   //     .addTo(map)
// //   //     .bindPopup(`
// //   //       <b>${issue.title}</b><br>
// //   //       ${issue.category}<br>
// //   //       ${issue.status}
// //   //     `);

// //   //   markers.push(marker);
// //   //   bounds.push([latitude, longitude]);
// //   // });
// //   issues.forEach(issue => {
// //   if (!issue.location) return;

// //   const latitude = parseFloat(issue.location.latitude);
// //   const longitude = parseFloat(issue.location.longitude);

// //   if (isNaN(latitude) || isNaN(longitude)) return;

// //   let icon = redIcon;
// //   if (issue.status === "In Progress") icon = yellowIcon;
// //   if (issue.status === "Resolved") icon = greenIcon;

// //   const marker = L.marker([latitude, longitude], { icon })
// //     .addTo(map)
// //     .bindPopup(`
// //       <b>${issue.title}</b><br>
// //       Category: ${issue.category}<br>
// //       Status: ${issue.status}
// //     `);

// //   markers.push(marker);
// // });


// //   if (bounds.length) {
// //     map.fitBounds(bounds, { padding: [40, 40] });
// //   }

// //   // 🔥 Hotspots
// //   const hotspots = detectHotspots(issues);
// //   hotspots.forEach(h => {
// //     L.circle([h.latitude, h.longitude], {
// //       radius: 400 + h.count * 50,
// //       color: "red",
// //       fillColor: "#ef4444",
// //       fillOpacity: 0.25,
// //     }).addTo(hotspotLayer)
// //       .bindPopup(`🚨 ${h.count} nearby issues`);
// //   });
// // }



// let markers = [];

// function loadIssuesOnMap(issues) {
//   console.log("📍 Rendering markers:", issues.length);

//    hotspotLayer.clearLayers();


//   // clear old markers
//   markers.forEach(m => map.removeLayer(m));
//   markers = [];

//   const bounds = [];

//   issues.forEach(issue => {
//     if (!issue.location) return;

//     const lat = Number(issue.location.latitude);
//     const lng = Number(issue.location.longitude);

//     if (!lat || !lng) {
//       console.warn("❌ Invalid coords", issue);
//       return;
//     }

//     const marker = L.marker([lat, lng])
//       .addTo(map)
//       .bindPopup(`
//         <b>${issue.title}</b><br>
//         ${issue.description || ""}
//       `);

//     markers.push(marker);
//     bounds.push([lat, lng]);
//   });

//   if (bounds.length > 0) {
//     map.fitBounds(bounds, { padding: [40, 40] });
//   }
// }




















document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Admin loaded");

  map = L.map("map").setView([19.8762, 75.3433], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  console.log("🗺️ MAP CREATED", map);

  loadAdminIssues(); // 👈 VERY IMPORTANT
});


// function loadIssuesOnMap(issues) {
//   console.log("📍 Rendering markers:", issues.length);

//   // remove old markers
//   markers.forEach(m => map.removeLayer(m));
//   markers = [];

//   issues.forEach(issue => {
//     if (!issue.location) return;

//     const { latitude, longitude } = issue.location;
//     if (latitude == null || longitude == null) return;

//     const marker = L.marker([latitude, longitude])
//       .addTo(map)
//       .bindPopup(`
//         <b>${issue.title}</b><br/>
//         ${issue.category}<br/>
//         ${issue.status}
//       `);

//     markers.push(marker);
//   });

//   // auto zoom
//   if (markers.length > 0) {
//     const group = L.featureGroup(markers);
//     map.fitBounds(group.getBounds().pad(0.2));
//   }
// }
function loadIssuesOnMap(issues) {
  console.log("📍 Rendering markers:", issues.length);

  if (!map) return;

  // 🧹 clear old markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  issues.forEach(issue => {
    if (!issue.location) return;

    const { latitude, longitude } = issue.location;
    if (latitude == null || longitude == null) return;

    // 🔥 decide marker icon
    let icon = redIcon; // default = Pending

    if (isHotspot(issue, issues)) {
      icon = hotspotIcon; // 🔥 HOTSPOT
    } else if (issue.status === "In Progress") {
      icon = yellowIcon;
    } else if (issue.status === "Resolved") {
      icon = greenIcon;
    }

    const marker = L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindPopup(`
        <b>${issue.title}</b><br/>
        Category: ${issue.category}<br/>
        Status: ${isHotspot(issue, issues) ? "🔥 Hotspot" : issue.status}
      `);

    markers.push(marker);
  });

  // 🔍 auto-zoom safely
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }
}


async function loadAdminIssues() {
  try {
    const res = await fetch("http://localhost:5000/api/issues");
    const data = await res.json();

    console.log("📦 Issues:", data);

    allIssues = data.map(i => ({ ...i, id: i._id }));

    renderIssues(allIssues);     // table
    loadIssuesOnMap(allIssues);  // map ✅

  } catch (err) {
    console.error("❌ Admin fetch failed", err);
  }
}








function getStatusBadge(issue, allIssues) {
  let html = "";

  // ✅ Status FIRST
  if (issue.status === "Pending") {
    html += `<span class="status-badge status-pending">Pending</span>`;
  } 
  else if (issue.status === "In Progress") {
    html += `<span class="status-badge status-in-progress">In Progress</span>`;
  } 
  else if (issue.status === "Resolved") {
    html += `<span class="status-badge status-resolved">Resolved</span>`;
  }

  // 🔥 Hotspot = EXTRA, not replacement
  if (isHotspot(issue, allIssues)) {
    html += `<div class="hotspot-badge">🔥 Hotspot</div>`;
  }

  return html;
}




const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const yellowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [32, 32],
});

const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const hotspotIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [32, 32],
});



let refreshTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Admin loaded");

  loadAdminIssues();

  // 🔁 Auto refresh (only once)
  refreshTimer = setInterval(loadAdminIssues, 20000);
});