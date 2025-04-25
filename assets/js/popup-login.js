function openPopup(tab) {
  document.getElementById("popup").style.display = "flex";
  switchTab(tab);
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function switchTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const registerTab = document.querySelector(".tab-btn:nth-child(1)");
  const loginTab = document.querySelector(".tab-btn:nth-child(2)");

  if (!loginForm || !registerForm || !registerTab || !loginTab) return;

  if (tab === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
  } else {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector(".login");
  const signupBtn = document.querySelector(".signup");
  const popup = document.getElementById("popup");

  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      openPopup("login");
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", function () {
      openPopup("register");
    });
  }

  if (popup) {
    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        closePopup();
      }
    });
  }
});