// register.js
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const regexName = /^[\p{L}\s]{2,}$/u;

function sanitizeInput(input) {
  return input.replace(/[<>{}]/g, "");
}

function validateInput(input, regex, errorMessage, maxLength = 255) {
  const value = input.value.trim();
  if (!value) {
    handleInValidValue(input, "Trường này không được để trống.");
    return false;
  }
  if (value.length > maxLength) {
    handleInValidValue(input, `Trường này không được vượt quá ${maxLength} ký tự.`);
    return false;
  }
  if (!regex.test(value)) {
    handleInValidValue(input, errorMessage);
    return false;
  }
  handleValidValue(input);
  return true;
}

function validateConfirmPassword(confirmInput, passwordInput) {
  if (!confirmInput.value.trim()) {
    handleInValidValue(confirmInput, "Trường này không được để trống.");
    return false;
  }
  if (confirmInput.value !== passwordInput.value) {
    handleInValidValue(confirmInput, "Mật khẩu xác nhận không khớp.");
    return false;
  }
  handleValidValue(confirmInput);
  return true;
}

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
  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const registerBtn = document.querySelector(".submit-register-btn");

  const requiredElements = [
    { element: registerName, name: "registerName" },
    { element: registerEmail, name: "registerEmail" },
    { element: registerPassword, name: "registerPassword" },
    { element: confirmPassword, name: "confirmPassword" },
    { element: registerBtn, name: "submit-register-btn" },
  ];

  for (const { element, name } of requiredElements) {
    if (!element) {
      console.error(`Phần tử ${name} không tồn tại trong DOM.`);
      return;
    }
  }

  if (registerName) {
    registerName.addEventListener("blur", () => {
      validateInput(
        registerName,
        regexName,
        "Tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái."
      );
    });
  }

  if (registerEmail) {
    registerEmail.addEventListener("blur", () => {
      validateInput(registerEmail, regexEmail, "Email không hợp lệ.");
    });
  }

  if (registerPassword) {
    registerPassword.addEventListener("blur", () => {
      validateInput(
        registerPassword,
        regexPassword,
        "Mật khẩu ít nhất 6 ký tự và chứa ít nhất một chữ cái và một số."
      );
    });
  }

  if (confirmPassword) {
    confirmPassword.addEventListener("blur", () => {
      validateConfirmPassword(confirmPassword, registerPassword);
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let isValid = true;

      isValid &= validateInput(
        registerName,
        regexName,
        "Tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái."
      );
      isValid &= validateInput(registerEmail, regexEmail, "Email không hợp lệ.");
      isValid &= validateInput(
        registerPassword,
        regexPassword,
        "Mật khẩu ít nhất 6 ký tự và chứa ít nhất một chữ cái và một số."
      );
      isValid &= validateConfirmPassword(confirmPassword, registerPassword);

      if (isValid) {
        registerBtn.disabled = true;
        registerBtn.textContent = "Đang xử lý...";

        const username = registerName.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value;
        const pageRole = document.body.dataset.role;
        const roles = pageRole === "host" ? ["ROLE_HOST"] : ["ROLE_USER"];

        registerUser(username, email, password, roles)
          .then((message) => {
            alert("Đăng ký thành công");
            setTimeout(() => {
              window.location.reload();
              const popup = document.getElementById("popup");
              if (popup) popup.style.display = "none";
            }, 1000);
          })
          .catch((err) => {
            alert("Đăng ký thất bại: " + (err.message || "Vui lòng thử lại."));
            console.error("Lỗi đăng ký:", err);
          })
          .finally(() => {
            registerBtn.disabled = false;
            registerBtn.textContent = "Đăng ký";
          });
      }
    });
  }
}

function registerUser(username, email, password, roles) {
  const sanitizedUsername = sanitizeInput(username);
  const sanitizedEmail = sanitizeInput(email);
  const payload = { username: sanitizedUsername, email: sanitizedEmail, password, roles };
  
  return fetch("http://localhost:8080/homestay/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((text) => {
        try {
          const json = JSON.parse(text);
          if (json.code === "DUPLICATE_EMAIL") {
            return Promise.reject({ message: "Email đã được sử dụng." });
          } else if (json.code === "DUPLICATE_USERNAME") {
            return Promise.reject({ message: "Tên người dùng đã được sử dụng." });
          }
          return Promise.reject(json);
        } catch (e) {
          return Promise.reject({ message: text || "Lỗi không xác định từ server." });
        }
      });
    }
    return res.text();
  });
}

export { handleValidValue, handleInValidValue, setupValidation };
