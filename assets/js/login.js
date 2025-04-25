document.addEventListener("DOMContentLoaded", function () {
  // Đảm bảo rằng tất cả các phần tử đã được tải
  const loginBtn = document.querySelector(".submit-login-btn");
  const signupBtn = document.querySelector(".submit-register-btn");
  const logoutBtn = document.getElementById("logoutBtn"); // Phần tử đăng xuất
  const popup = document.getElementById("popup");

  // Kiểm tra trạng thái đăng nhập và cập nhật giao diện
  checkLoginStatus();

  // Giải mã JWT
  function decodeJWT(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  // Đăng nhập
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      if (!email.trim() || !password.trim()) {
        alert("Vui lòng nhập đầy đủ email và mật khẩu.");
        return;
      }

      fetch("http://localhost:8080/homestay/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("authToken", data.token);
            alert("Đăng nhập thành công!");
            checkLoginStatus(); // Gọi lại để cập nhật giao diện
            closePopup();
          } else {
            alert("Đăng nhập thất bại.");
          }
        })
        .catch(() => alert("Đã có lỗi xảy ra. Thử lại sau."));
    });
  }

  // Đăng ký (Hiện tại chỉ là thông báo)
  if (signupBtn) {
    signupBtn.addEventListener("click", function () {
      alert("Đăng ký được nhấn.");
    });
  }

  // Đóng popup khi nhấn ngoài
  if (popup) {
    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        closePopup();
      }
    });
  }

  // Đóng popup
  function closePopup() {
    popup.style.display = "none";
  }

  // Đăng xuất
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("authToken"); // Xóa token khỏi localStorage
      checkLoginStatus(); // Cập nhật lại giao diện sau khi đăng xuất
    });
  }

  // Kiểm tra trạng thái đăng nhập và cập nhật giao diện
  function checkLoginStatus() {
    const token = localStorage.getItem("authToken");
    const authButtons = document.getElementById("auth-buttons");
    const userInfo = document.getElementById("user-info");
    const userEmail = document.getElementById("user-email");

    if (authButtons && userInfo && userEmail) {
      if (token) {
        authButtons.style.display = "none"; // Ẩn nút đăng nhập, đăng ký
        userInfo.style.display = "block"; // Hiển thị thông tin người dùng
        const user = decodeJWT(token); // Giải mã token JWT
        userEmail.textContent = `Chào, ${user.sub}`; // Hiển thị email người dùng

        // Hiển thị nút đăng xuất nếu người dùng đã đăng nhập
        if (logoutBtn) {
          logoutBtn.style.display = "inline-block"; // Hiển thị nút đăng xuất
        }
      } else {
        authButtons.style.display = "block"; // Hiển thị nút đăng nhập, đăng ký
        userInfo.style.display = "none"; // Ẩn thông tin người dùng
        if (logoutBtn) {
          logoutBtn.style.display = "none"; // Ẩn nút đăng xuất nếu chưa đăng nhập
        }
      }
    }
  }
});