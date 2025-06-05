// register.js
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const regexName = /^[\p{L}\s]{2,}$/u;

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

  if (registerName) {
    registerName.addEventListener("blur", () => {
      if (regexName.test(registerName.value.trim())) {
        handleValidValue(registerName);
      } else {
        const message = "Tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái.";
        handleInValidValue(registerName, message);
      }
    });
  }

  if (registerEmail) {
    registerEmail.addEventListener("blur", () => {
      if (regexEmail.test(registerEmail.value)) {
        handleValidValue(registerEmail);
      } else {
        const message = "Email không hợp lệ.";
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

  if (registerBtn) {
    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let isValid = true;

      if (!regexName.test(registerName.value.trim())) {
        handleInValidValue(
          registerName,
          "Tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái."
        );
        isValid = false;
      } else {
        handleValidValue(registerName);
      }

      if (!regexEmail.test(registerEmail.value)) {
        handleInValidValue(registerEmail, "Email không hợp lệ.");
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

        const pageRole = document.body.dataset.role;
        const roles = pageRole === "host" ? ["ROLE_HOST"] : ["ROLE_USER"];

        registerUser(username, email, password, roles)
          .then((message) => {
            alert("Đăng ký thành công: ");
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

function registerUser(username, email, password, roles) {
  const registerBtn = document.querySelector(".submit-register-btn");
  if (registerBtn) {
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
}

export { handleValidValue, handleInValidValue, setupValidation, registerUser };
