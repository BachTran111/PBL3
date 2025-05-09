// partner-register.js
import { showHidePassword } from "./show-hide-password.js";

// Validation logic
const regexUsername = /^[a-zA-Z]{3,}$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

function handleValidValue(input) {
  const small = input.parentElement.nextElementSibling;
  small.style.visibility = "hidden";
  input.classList.remove("error");
  input.classList.add("success");
}

function handleInValidValue(input, message) {
  const small = input.parentElement.nextElementSibling;
  small.textContent = message;
  small.style.visibility = "visible";
  input.classList.remove("success");
  input.classList.add("error");
}

function setupValidation() {
  const username = document.getElementById("username");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const form = document.getElementById("partner-register-form");

  if (username) {
    username.addEventListener("blur", () => {
      if (regexUsername.test(username.value.trim())) {
        handleValidValue(username);
      } else {
        const message =
          "Tên người dùng phải có ít nhất 3 ký tự, chỉ chứa chữ cái và không có khoảng trắng.";
        handleInValidValue(username, message);
      }
    });
  }

  if (registerEmail) {
    registerEmail.addEventListener("blur", () => {
      if (regexEmail.test(registerEmail.value)) {
        handleValidValue(registerEmail);
      } else {
        const message =
          "Định dạng email không hợp lệ. Vui lòng nhập email hợp lệ.";
        handleInValidValue(registerEmail, message);
      }
    });
  }

  if (registerPassword) {
    registerPassword.addEventListener("blur", () => {
      if (regexPassword.test(registerPassword.value)) {
        handleValidValue(registerPassword);
      } else {
        const message =
          "Mật khẩu ít nhất 6 ký tự và chứa ít nhất một chữ cái và một số.";
        handleInValidValue(registerPassword, message);
      }
    });
  }

  if (confirmPassword) {
    confirmPassword.addEventListener("blur", () => {
      if (
        confirmPassword.value === registerPassword.value &&
        confirmPassword.value !== ""
      ) {
        handleValidValue(confirmPassword);
      } else {
        const message = "Mật khẩu xác nhận không khớp.";
        handleInValidValue(confirmPassword, message);
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      if (!regexUsername.test(registerName.value.trim())) {
        handleInValidValue(
          registerName,
          "Tên người dùng phải có ít nhất 3 ký tự, chỉ chứa chữ cái và không có khoảng trắng."
        );
        isValid = false;
      } else {
        handleValidValue(registerName);
      }

      if (!regexEmail.test(registerEmail.value)) {
        handleInValidValue(
          registerEmail,
          "Định dạng email không hợp lệ. Vui lòng nhập email hợp lệ."
        );
        isValid = false;
      } else {
        handleValidValue(registerEmail);
      }

      if (!regexPassword.test(registerPassword.value)) {
        handleInValidValue(
          registerPassword,
          "Mật khẩu ít nhất 6 ký tự và chứa ít nhất một chữ cái và một số."
        );
        isValid = false;
      } else {
        handleValidValue(registerPassword);
      }

      if (
        confirmPassword.value !== registerPassword.value ||
        confirmPassword.value === ""
      ) {
        handleInValidValue(confirmPassword, "Mật khẩu xác nhận không khớp.");
        isValid = false;
      } else {
        handleValidValue(confirmPassword);
      }

      if (isValid) {
        // Lấy giá trị input
        const username = registerName.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value;

        const pageRole = document.body.dataset.role; // "user" hoặc "host"
        const roles = pageRole === "host" ? ["ROLE_HOST"] : ["ROLE_USER"];

        registerUser(username, email, password, roles)
          .then((message) => {
            alert("Đăng ký thành công: " + message);
            document.getElementById("popup").style.display = "none";
          })
          .catch((err) => {
            alert("Đăng ký thất bại: " + (err.message || "Vui lòng thử lại."));
            console.error("Lỗi đăng ký:", err);
          });
      }
    });
  }
}

// Slider logic
function setupSlider() {
  let slideIndex = 0;
  const sliderContent = document.querySelector(".slider-content");
  const paginationDots = document.querySelectorAll(".pagination-dot");
  const slideWidth = document.querySelector(".slide").offsetWidth;

  function goToSlide(index) {
    slideIndex = index;
    sliderContent.style.transform = `translateX(-${slideIndex * slideWidth}px)`;

    paginationDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === slideIndex);
    });
  }

  setInterval(() => {
    slideIndex++;
    if (slideIndex >= 3) {
      slideIndex = 0;
    }
    goToSlide(slideIndex);
  }, 3000);

  goToSlide(slideIndex);
}

function registerUser(username, email, password, roles) {
  const payload = { username, email, password, roles };

  return fetch("http://localhost:8080/homestay/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((text) => {
        try {
          const json = JSON.parse(text);
          return Promise.reject(json);
        } catch (e) {
          return Promise.reject({ message: text });
        }
      });
    }
    return res.text();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupValidation();
  showHidePassword();
  setupSlider();
});
