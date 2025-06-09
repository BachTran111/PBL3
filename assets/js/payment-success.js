document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const responseCode = urlParams.get("vnp_ResponseCode");
  const transactionStatus = urlParams.get("vnp_TransactionStatus");
  const transactionId = urlParams.get("vnp_TxnRef");
  const amount = urlParams.get("vnp_Amount");
  const orderInfo = urlParams.get("vnp_OrderInfo");

  const queryString = urlParams.toString();
  fetch(`http://localhost:8080/homestay/api/payment/vnpay-return?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const orderMessage = document.getElementById("order-message");
      const messageDetail = document.getElementById("message-detail");
      const transactionInfo = document.getElementById("transaction-info");
      const actionButton = document.getElementById("action-button");

      if (data.status === "success" && responseCode === "00" && transactionStatus === "00") {
        // Trường hợp thanh toán thành công
        const formattedAmount = (parseInt(amount) / 100).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        const orderIdMatch = orderInfo ? orderInfo.match(/#(\d+)/) : null;
        const orderId = orderIdMatch ? orderIdMatch[1] : "Không xác định";

        orderMessage.textContent = `Thanh toán thành công.`;
        orderMessage.classList.add("text-success");
        messageDetail.textContent = "Cảm ơn bạn đã đặt phòng. Đơn đặt phòng của bạn đã được xác nhận.";
        transactionInfo.innerHTML = `
          Mã giao dịch: ${transactionId}<br>
          Số tiền: ${formattedAmount}
        `;
        actionButton.onclick = () => (window.location.href = "my-booking.html");
      } else {
        // Trường hợp thanh toán thất bại (bao gồm hủy thanh toán)
        orderMessage.textContent = "Thanh toán thất bại!";
        orderMessage.classList.add("text-danger");
        if (responseCode === "24") {
          messageDetail.textContent = "Giao dịch đã bị hủy bởi người dùng.";
        } else {
          messageDetail.textContent = "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.";
        }
        transactionInfo.innerHTML = `Mã giao dịch: ${transactionId || "Không xác định"}`;
        actionButton.onclick = () => (window.location.href = "my-booking.html");
      }
    })
    .catch((error) => {
      console.error("Error calling backend:", error);
      const orderMessage = document.getElementById("order-message");
      const messageDetail = document.getElementById("message-detail");
      const transactionInfo = document.getElementById("transaction-info");
      const actionButton = document.getElementById("action-button");

      orderMessage.textContent = "Thanh toán thất bại!";
      orderMessage.classList.add("text-danger");
      messageDetail.textContent = "Lỗi kết nối với server. Vui lòng thử lại.";
      transactionInfo.innerHTML = `Mã giao dịch: ${transactionId || "Không xác định"}`;
      actionButton.onclick = () => (window.location.href = "trang-chu.html");
    });
});