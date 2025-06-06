// assets/js/popup-login.js
import { login } from "./login.js";
function openPopup(tab) {
  document.getElementById("popup").style.display = "flex";
  switchTab(tab);
  if (tab === "login") {
    login();
  }
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function switchTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const registerTab = document.querySelector(".btn-register");
  const loginTab = document.querySelector(".btn-login");

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

function setupPopupEventListeners() {
  const loginBtn = document.querySelector(".login");
  const signupBtn = document.querySelector(".signup");
  const popup = document.getElementById("popup");

  const closeBtn = document.querySelector(".close-btn");
  const tabLoginBtn = document.querySelector(".btn-login");
  const tabRegisterBtn = document.querySelector(".btn-register");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => openPopup("login"));
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => openPopup("register"));
  }

  if (popup) {
    popup.addEventListener("click", (event) => {
      if (event.target === popup) {
        closePopup();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closePopup();
    });
  }

  if (tabLoginBtn) {
    tabLoginBtn.addEventListener("click", () => {
      switchTab("login");
    });
  }

  if (tabRegisterBtn) {
    tabRegisterBtn.addEventListener("click", () => {
      switchTab("register");
    });
  }
}

export { openPopup, closePopup, setupPopupEventListeners };
