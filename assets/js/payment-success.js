document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const responseCode = urlParams.get("vnp_ResponseCode");
  const transactionStatus = urlParams.get("vnp_TransactionStatus");
  const transactionId = urlParams.get("vnp_TxnRef");
  const amount = urlParams.get("vnp_Amount");
  const orderInfo = urlParams.get("vnp_OrderInfo");

  // Gửi request đến BE để lưu thanh toán
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
      if (data.status === "success" && responseCode === "00" && transactionStatus === "00") {
        const formattedAmount = (parseInt(amount) / 100).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        const orderIdMatch = orderInfo ? orderInfo.match(/#(\d+)/) : null;
        const orderId = orderIdMatch ? orderIdMatch[1] : "Không xác định";
        document.getElementById("order-message").textContent = `Thanh toán thành công cho đơn #${orderId}.`;
        document.getElementById("transaction-info").innerHTML = `
                Mã giao dịch: ${transactionId}<br>
                Số tiền: ${formattedAmount}
            `;
      } else {
        alert("Thanh toán không thành công. Vui lòng thử lại.");
        window.location.href = "trang-chu.html";
      }
    })
    // .catch((error) => {
    //   console.error("Error calling backend:", error);
    //   alert("Lỗi kết nối với server. Vui lòng thử lại.");
    //   window.location.href = "trang-chu.html";
    // });
});
