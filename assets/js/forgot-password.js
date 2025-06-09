document.addEventListener("DOMContentLoaded", () => {
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const emailInput = document.getElementById("emailInput");
  const otpInput = document.getElementById("otpInput");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  // Hàm xử lý response từ server
  async function handleResponse(response) {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return {
        message: text,
        status: response.status,
      };
    }
  }

  // Bước 1: Gửi email để nhận OTP
  step1.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      alert("Vui lòng nhập email hợp lệ");
      return;
    }

    try {
      // Gọi API forgot-password
      const response = await fetch(
        "http://localhost:8080/homestay/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await handleResponse(response);

      if (response.ok) {
        localStorage.setItem("resetEmail", email);
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
      } else {
        alert(result.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (error) {
      alert("Lỗi kết nối, vui lòng thử lại");
      console.error("Error:", error);
    }
  });

  // Bước 2: Xác nhận OTP
  step2.addEventListener("submit", (e) => {
    e.preventDefault();

    const otp = otpInput.value.trim();
    if (!otp || otp.length !== 6) {
      alert("Vui lòng nhập mã OTP 6 chữ số");
      return;
    }

    localStorage.setItem("resetOtp", otp);
    step2.classList.add("hidden");
    step3.classList.remove("hidden");
  });

  // Bước 3: Đặt lại mật khẩu
  step3.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Kiểm tra mật khẩu
    if (newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      const email = localStorage.getItem("resetEmail");
      const otp = localStorage.getItem("resetOtp");

      if (!email || !otp) {
        alert("Thông tin không hợp lệ, vui lòng thử lại");
        return;
      }

      // Gọi API reset-password
      const response = await fetch(
        "http://localhost:8080/homestay/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
            otp,
          }),
        }
      );

      const result = await handleResponse(response);

      if (response.ok) {
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetOtp");

        alert(
          "Đặt lại mật khẩu thành công! Bạn sẽ được chuyển về trang đăng nhập."
        );
        window.location.href = "trang-chu.html";
      } else {
        alert(result.message || "Có lỗi xảy ra, vui lòng thử lại");
        window.location.href = "forgot-password.html";
      }
    } catch (error) {
      alert("Lỗi kết nối, vui lòng thử lại");
      console.error("Error:", error);
    }
  });

  // Hàm kiểm tra email hợp lệ
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});
