// async function adminLogin() {
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;
//   const error = document.getElementById("error");

//   try {
//     // const res = await fetch("http://localhost:5000/api/auth/login", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify({ email, password })
//     // });
//     const res = await fetch("http://localhost:5000/api/auth/login", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     email,
//     password
//   })
// });


//     const data = await res.json();

//     if (!res.ok) {
//       error.innerText = data.message || "Login failed";
//       return;
//     }

//     // 🔥 ROLE CHECK
//     if (data.user.role !== "admin") {
//       error.innerText = "Not authorized as admin";
//       return;
//     }

//     // ✅ SAVE TOKEN
//     localStorage.setItem("token", data.token);

//     // ✅ REDIRECT
//     window.location.href = "admin.html";

//   } catch (err) {
//     error.innerText = "Server error";
//   }
// }


// const API_BASE_URL = "http://localhost:5000/api";

// async function adminLogin() {
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();
//   const errorEl = document.getElementById("error");

//   errorEl.innerText = "";

//   try {
//     const res = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password })
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       errorEl.innerText = data.message || "Login failed";
//       return;
//     }

//     // 🔒 ADMIN CHECK
//     if (data.user.role !== "admin") {
//       errorEl.innerText = "Not authorized as admin";
//       return;
//     }

//     // ✅ SAVE TOKEN
//     localStorage.setItem("token", data.token);
    
//     localStorage.setItem("userRole", data.user.role);

//     // ✅ REDIRECT TO ADMIN DASHBOARD
//     window.location.href = "/admin";

//   } catch (err) {
//     errorEl.innerText = "Server not reachable";
//   }
// }




async function adminLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      error.innerText = data.message || "Login failed";
      return;
    }

    // 🔥 CRITICAL CHECK
    if (data.user.role !== "admin") {
      error.innerText = "Not an admin account";
      return;
    }

    // Save login
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 🚀 Redirect to SERVER route (not html)
    window.location.href = "/admin";

  } catch (err) {
    error.innerText = "Server error";
  }
}
