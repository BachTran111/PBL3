window.onload = function () {
  const homestayList = document.querySelector(".homestay-list");

  const token = localStorage.getItem("authToken");

  const decodedToken = jwt_decode(token);
  const hostId = decodedToken.host_id;

  fetch("http://localhost:8080/homestay/api/homestays/my", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      homestayList.innerHTML = "";
      data.forEach((homestay) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <a href="#" class="homestay-toggle" data-id="${homestay.id}">
            ${homestay.name}
          </a>
          <ul class="sub-menu" style="display: none">
            <li>
              <a href="#" class="tab-link" data-tab="view-all-room" data-hid="${homestay.id}">
                Tất cả phòng
              </a>
            </li>
            <li>
              <a href="#" class="tab-link" data-tab="add-room" data-hid="${homestay.id}">
                Thêm phòng
              </a>
            </li>
          </ul>
        `;
        li.querySelector(".homestay-toggle").addEventListener("click", (e) => {
          e.preventDefault();
          const sm = li.querySelector(".sub-menu");
          sm.style.display = sm.style.display === "block" ? "none" : "block";
        });
        homestayList.appendChild(li);
      });
      homestayList.style.display = "block";
    })
    .catch((err) => console.error("Lỗi khi load homestay:", err));

  document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("tab-link")) return;
    e.preventDefault();

    const tabId = e.target.dataset.tab;
    const homestayId = e.target.dataset.hid;

    document
      .querySelectorAll(".tab-content")
      .forEach((tc) => (tc.style.display = "none"));

    if (tabId === "view-all-room") {
      showRoomList(homestayId);
    } else if (tabId == "add-room") {
      showAddForm(homestayId);
    } else if (tabId == "view-all-pending-room") {
      showPendingRoomList(homestayId);
    } else {
      const tab = document.getElementById(tabId);
      if (tab) {
        tab.style.display = "block";
        renderBookingTable(bookings);
      }
    }
  });

  function showRoomList(homestayId) {
    const viewTab = document.getElementById("view-all-room");
    viewTab.style.display = "block";

    fetch(
      `http://localhost:8080/homestay/api/rooms/valid-homestay/${homestayId}`
    )
      .then((res) => res.json())
      .then((rooms) => {
        const tbody = viewTab.querySelector(".room-table tbody");
        tbody.innerHTML = "";
        if (!rooms.length) {
          tbody.innerHTML = '<tr><td colspan="6">Không có phòng nào.</td></tr>';
          return;
        }
        rooms.forEach((r) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${r.roomId}</td>
            <td>${r.roomType}</td>
            <td>${Number(r.price).toLocaleString("vi-VN")}đ</td>
            <td>${r.availability ? "Còn trống" : "Đang được sử dụng"}</td>
            <td>
              <button class="btn btn-view"  data-id="${r.roomIdd}">Xem</button>
              <button class="btn btn-edit"  data-id="${r.roomId}">Sửa</button>
              <button class="btn btn-delete" data-id="${r.roomId}">Xóa</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch((err) => console.error("Lỗi load phòng:", err));
  }

  function showAddForm(homestayId) {
    const addTab = document.getElementById("add-room");
    addTab.style.display = "block";

    let hidden = addTab.querySelector("input[name='homestayId']");
    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "homestayId";
      addTab.querySelector(".card-box").appendChild(hidden);
    }
    hidden.value = homestayId;
  }

  window.returnToDefault = function () {
    document
      .querySelectorAll(".tab-content")
      .forEach((tc) => (tc.style.display = "none"));
    document.getElementById("default-content").style.display = "block";
  };

  function showAddForm(homestayId) {
    const addTab = document.getElementById("add-room");
    addTab.style.display = "block";

    let hidden = addTab.querySelector("input[name='homestayId']");
    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "homestayId";
      addTab.querySelector(".card-box").appendChild(hidden);
    }
    hidden.value = homestayId;
  }

  function renderBookingTable(data) {
    const tbody = document.querySelector("#manage-bookings tbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8">Không có đơn đặt phòng nào.</td></tr>';
      return;
    }

    data.forEach((b) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${b.homestayName}</td>
            <td>${b.room_id}</td>
            <td>${b.email}</td>
            <td>${b.check_in_date}</td>
            <td>${b.check_out_date}</td>
            <td>${Number(b.total_price).toLocaleString("vi-VN")}đ</td>
            <td>${b.created_at}</td>
            <td>
                <button class="btn btn-view">Phê duyệt</button>
                <button class="btn btn-delete">Từ chối</button>
            </td>
        `;
      tbody.appendChild(tr);
    });
  }

  window.returnToDefault = function () {
    document
      .querySelectorAll(".tab-content")
      .forEach((tc) => (tc.style.display = "none"));
    document.getElementById("default-content").style.display = "block";
  };
  //Them

  document.getElementById("submit-room").addEventListener("click", function () {
    const roomType = document.querySelector(
      "input[name='RoomType']:checked"
    )?.value;
    const price = document.getElementById("Price").value;
    const featuresEls = document.querySelectorAll(
      "input[name='Facilities']:checked"
    );
    const features = Array.from(featuresEls)
      .map((el) => el.value)
      .join(", ");

    if (!roomType || !price || !features) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const homestayId = document.querySelector(
      "#add-room input[name='homestayId']"
    ).value;

    const roomData = {
      roomType: roomType,
      price: price,
      features: features,
    };

    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8080/homestay/api/rooms/homestay/${homestayId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roomData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi thêm phòng");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Phòng được thêm thành công:", data);
        alert("Phòng đã được thêm thành công!");
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi khi thêm phòng!");
      });
  });
};

window.loadPendingBookings = function () {
  const token = localStorage.getItem("authToken");
  if (!token) return console.error("Token không tồn tại");

  const decodedToken = jwt_decode(token);
  const hostId = decodedToken.host_id;

  fetch(`http://localhost:8080/homestay/api/bookings/pending/${hostId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Không thể tải danh sách booking");
      return res.json();
    })
    .then((bookings) => {
      const tableBody = document.getElementById("booking-table-body");
      tableBody.innerHTML = "";

      bookings.forEach((booking) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${booking.homestayName}</td>
          <td>${booking.roomId}</td>
          <td>${booking.userEmail}</td>
          <td>${booking.checkInDate}</td>
          <td>${booking.checkOutDate}</td>
          <td>${booking.totalPrice.toLocaleString()}₫</td>
          <td>${booking.createdAt}</td>
          <td>
            <button class="approve-btn" data-id="${
              booking.bookingId
            }">✔️</button>
            <button class="reject-btn" data-id="${
              booking.bookingId
            }">❌</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      // Thêm event listeners cho các nút approve/reject
      document.querySelectorAll(".approve-btn").forEach((btn) => {
        btn.addEventListener("click", handleApprove);
      });

      document.querySelectorAll(".reject-btn").forEach((btn) => {
        btn.addEventListener("click", handleReject);
      });
    })
    .catch((err) => console.error("Lỗi khi load booking:", err));
};

// Hàm xử lý Approve
function handleApprove(event) {
  const bookingId = event.target.getAttribute("data-id");
  const token = localStorage.getItem("authToken");

  fetch(
    `http://localhost:8080/homestay/api/bookings/host/pending/${bookingId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi duyệt booking");
      return response.json();
    })
    .then((data) => {
      alert("Đã duyệt thành công!");
      loadPendingBookings();
    })
    .catch((error) => {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi duyệt");
    });
}

// Hàm xử lý Reject
function handleReject(event) {
  const bookingId = event.target.getAttribute("data-id");
  const token = localStorage.getItem("authToken");

  fetch(
    `http://localhost:8080/homestay/api/bookings/host/reject/${bookingId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi reject booking");
      return response.json();
    })
    .then((data) => {
      alert("Đã reject booking thành công!");
      loadPendingBookings(); // Refresh danh sách
    })
    .catch((error) => {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi reject booking");
    });
}
