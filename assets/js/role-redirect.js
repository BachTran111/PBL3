document.getElementById("profileLink")?.addEventListener("click", function (e) {
  e.preventDefault();
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const roles = user?.roles || [];

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "trang-chu.html";
    return;
  }

  if (roles.includes("ROLE_ADMIN")) {
    window.location.href = "admin-dashboard.html";
  } else if (roles.includes("ROLE_HOST")) {
    window.location.href = "host-dashboard.html";
  } else if (roles.includes("ROLE_USER")) {
    window.location.href = "my-booking.html";
  } else {
    alert("Không xác định được vai trò!");
    window.location.href = "trang-chu.html";
  }
});

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (error) {
    console.error("Token invalid:", error);
    return true;
  }
}
