// Get saved user from brpwser that we saved data of user just after login 
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

// ❌ If not logged in → kick out
if (!user || !token) {
  window.location.href = "public.html";
}

// Show data
document.getElementById("profileName").innerText = user.name || "N/A";
document.getElementById("profileRole").innerText = user.role || "N/A";


//put below after loadinng user 
document.getElementById("avatarLetter").innerText =
  user.name.charAt(0).toUpperCase();



// Email not stored? Fetch from backend
async function loadEmail() {
  const res = await fetch("http://localhost:5000/api/auth/me", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();
  document.getElementById("profileEmail").innerText = data.email;
}

loadEmail();

// Back button
document.getElementById("backBtn").onclick = () => {
  window.history.back();
};



