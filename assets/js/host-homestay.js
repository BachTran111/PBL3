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
              <li>
              <a href="#" class="tab-link" data-tab="edit-homestay" data-hid="${homestay.id}">
                Điều chỉnh homestay
              </a>
            </li>
          </ul>
        `;
        homestayList.appendChild(li);
      });
      homestayList.style.display = "none";
    })
    .catch((err) => console.error("Lỗi khi load homestay:", err));

  document.addEventListener("click", async function (e) {
    if (!e.target.classList.contains("tab-link")) return;
    e.preventDefault();

    const tabId = e.target.dataset.tab;
    const homestayId = e.target.dataset.hid;

    document
      .querySelectorAll(".tab-content")
      .forEach((tc) => (tc.style.display = "none"));

    if (tabId === "view-all-room") {
      showRoomList(homestayId);
    } else if (tabId === "add-room") {
      showAddForm(homestayId);
    } else if (tabId === "view-all-pending-room") {
      showPendingRoomList(homestayId);
    } else if (tabId === "edit-homestay") {
      handleEditHomestay(homestayId);
    } else {
      const tab = document.getElementById(tabId);
      if (tab) {
        tab.style.display = "block";
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
            <td>${r.availability ? "Đang hoạt động" : "Đang sửa chữa"}</td>
            <td>
              <button class="btn btn-edit"  data-id="${
                r.roomId
              }">Chỉnh sửa</button>
              <button class="btn btn-delete" data-id="${r.roomId}">Xóa</button>
            </td>
          `;
          // sửa phòng
          tr.querySelector(".btn-edit").addEventListener(
            "click",
            async function () {
              const roomId = this.getAttribute("data-id");
              const token = localStorage.getItem("authToken");
              const homestayId =
                this.closest("li")?.querySelector(".homestay-toggle")?.dataset
                  .id || ""; // Lấy homestayId từ data-id

              try {
                const res = await fetch(
                  `http://localhost:8080/homestay/api/rooms/${roomId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                if (!res.ok) throw new Error("Không thể lấy dữ liệu phòng");
                const data = await res.json();

                // Ghi log để kiểm tra dữ liệu
                console.log("Dữ liệu phòng:", data);

                // Điền dữ liệu vào form
                document.getElementById("editRoomId").value = data.roomId;
                document.getElementById("editPrice").value = data.price;
                document
                  .querySelectorAll("input[name='editRoomType']")
                  .forEach((el) => {
                    el.checked = el.value === data.roomType;
                  });

                const selectedFacilities = data.features?.split(", ") || [];
                document
                  .querySelectorAll("input[name='editFacilities']")
                  .forEach((el) => {
                    el.checked = selectedFacilities.includes(el.value);
                  });

                // Xử lý availability: nếu null, đặt mặc định là "false" hoặc yêu cầu người dùng chọn
                document.getElementById("editRoomAvailability").value =
                  data.availability === null
                    ? "false"
                    : data.availability
                    ? "true"
                    : "false";

                // Thêm input ẩn cho homestayId
                let hidden = document.querySelector(
                  "#edit-room input[name='homestayId']"
                );
                if (!hidden) {
                  hidden = document.createElement("input");
                  hidden.type = "hidden";
                  hidden.name = "homestayId";
                  document
                    .querySelector("#edit-room .card-box")
                    .appendChild(hidden);
                }
                hidden.value = homestayId; // Gán homestayIdAdd commentMore actions

                document.getElementById("edit-preview-container").innerHTML =
                  "";
                document
                  .querySelectorAll(".tab-content")
                  .forEach((t) => (t.style.display = "none"));
                document.getElementById("edit-room").style.display = "block";
              } catch (error) {
                console.error("Lỗi khi lấy dữ liệu phòng:", error);
                alert("Không thể tải dữ liệu phòng. Vui lòng thử lại sau.");
              }
            }
          );

          // xóa phòng
          tr.querySelector(".btn-delete").addEventListener(
            "click",
            async function () {
              const roomId = this.getAttribute("data-id");
              const token = localStorage.getItem("authToken");

              if (confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
                try {
                  await fetch(
                    `http://localhost:8080/homestay/api/rooms/${roomId}`,
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  alert("Phòng đã được xóa thành công!");

                  showRoomList(homestayId);
                } catch (error) {
                  console.error("Lỗi khi xóa phòng:", error);
                  alert("Không thể xóa phòng. Vui lòng thử lại sau.");
                }
              }
            }
          );
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

  window.returnToDefault = function () {
    document
      .querySelectorAll(".tab-content")
      .forEach((tc) => (tc.style.display = "none"));
    document.getElementById("default-content").style.display = "block";
  };

  document
    .getElementById("submit-room")
    .addEventListener("click", async function () {
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
      const imageFile = document.getElementById("room-image").files[0];

      if (!roomType || !price || !features) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      const homestayId = document.querySelector(
        "#add-room input[name='homestayId']"
      ).value;
      const token = localStorage.getItem("authToken");

      const roomData = {
        roomType: roomType,
        price: price,
        features: features,
      };

      try {
        const res = await fetch(
          `http://localhost:8080/homestay/api/rooms/homestay/${homestayId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(roomData),
          }
        );

        if (!res.ok) {
          throw new Error("Lỗi khi thêm phòng");
        }

        const room = await res.json();
        const roomId = room.roomId;

        // Gửi ảnh nếu có
        if (imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);

          const imgRes = await fetch(
            `http://localhost:8080/homestay/api/rooms/${roomId}/images`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!imgRes.ok) {
            throw new Error("Lỗi khi upload ảnh phòng");
          }
        }

        alert("Phòng đã được thêm thành công!");
        window.location.reload();
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi khi thêm phòng!");
      }
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
      if (bookings.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan="9">Không có booking nào đang chờ duyệt.</td></tr>';
        return;
      }
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
          <td class="payment-status">Đang kiểm tra...</td>
          <td>
            <button class="btn btn-approve" data-id="${
              booking.bookingId
            }">Chấp nhận</button>
            <button class="btn btn-reject" data-id="${
              booking.bookingId
            }">Từ chối</button>
          </td>
        `;
        tableBody.appendChild(row);

        fetch(
          `http://localhost:8080/homestay/api/payment/check/${booking.bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error("Lỗi kiểm tra thanh toán");
            return res.json();
          })
          .then((isPaid) => {
            row.querySelector(".payment-status").textContent = isPaid
              ? "Đã thanh toán"
              : "Chưa thanh toán";
          })
          .catch((err) => {
            console.error("Lỗi khi kiểm tra thanh toán:", err);
            row.querySelector(".payment-status").textContent = "Không xác định";
          });
      });

      document.querySelectorAll(".btn-approve").forEach((btn) => {
        btn.addEventListener("click", handleApprove);
      });

      document.querySelectorAll(".btn-reject").forEach((btn) => {
        btn.addEventListener("click", handleReject);
      });
    })
    .catch((err) => console.error("Lỗi khi load booking:", err));
};

function fetchPendingHomestays() {
  const token = localStorage.getItem("authToken");
  const decodedToken = jwt_decode(token);

  const tbody = document.getElementById("pending-homestay-list");
  tbody.innerHTML = "";

  function renderHomestays(data, isRejected = false) {
    if (data.length === 0 && !isRejected) {
      tbody.innerHTML =
        '<tr><td colspan="4">Không có homestay nào đang chờ duyệt.</td></tr>';
      return;
    }

    data.forEach((homestay) => {
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = homestay.name;
      if (isRejected) {
        const badge = document.createElement("span");
        badge.className = "badge-rejected";
        badge.textContent = " (Đã bị từ chối)";
        nameTd.appendChild(badge);
      }

      const addressTd = document.createElement("td");
      addressTd.textContent = `${homestay.street}, ${homestay.ward}, ${homestay.district}`;

      const createdAtTd = document.createElement("td");
      createdAtTd.textContent = new Date(homestay.createdAt).toLocaleString();

      const actionTd = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.textContent = "Chỉnh sửa";
      editBtn.className = "btn btn-edit";
      editBtn.setAttribute("data-id", homestay.id);

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Hủy yêu cầu";
      cancelBtn.className = "btn btn-cancel";
      cancelBtn.setAttribute("data-id", homestay.id);

      actionTd.appendChild(editBtn);
      actionTd.appendChild(cancelBtn);

      tr.appendChild(nameTd);
      tr.appendChild(addressTd);
      tr.appendChild(createdAtTd);
      tr.appendChild(actionTd);

      tbody.appendChild(tr);

      // Sự kiện click chỉnh sửa
      editBtn.addEventListener("click", async function () {
        const homestayId = this.getAttribute("data-id");
        handleEditHomestay(homestayId);
      });

      // Sự kiện click hủy
      cancelBtn.addEventListener("click", async function () {
        const homestayId = this.getAttribute("data-id");
        if (confirm("Bạn có chắc chắn muốn hủy yêu cầu homestay này?")) {
          try {
            const res = await fetch(
              `http://localhost:8080/homestay/api/homestays/${homestayId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!res.ok) throw new Error("Không thể hủy homestay");
            alert("Hủy homestay thành công!");
            fetchPendingHomestays();
          } catch (error) {
            console.error("Lỗi khi hủy homestay:", error);
            alert("Không thể hủy homestay. Vui lòng thử lại sau.");
          }
        }
      });
    });
  }

  // Fetch pending homestays
  fetch("http://localhost:8080/homestay/api/homestays/my_pending", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      renderHomestays(data);

      // Fetch rejected homestays tiếp theo
      return fetch("http://localhost:8080/homestay/api/homestays/my_rejected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((rejectedData) => {
      renderHomestays(rejectedData, true);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

async function handleEditHomestay(homestayId) {
  const token = localStorage.getItem("authToken");

  try {
    const res = await fetch(
      `http://localhost:8080/homestay/api/homestays/${homestayId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("Không thể lấy dữ liệu homestay");
    const homestay = await res.json();

    // Điền dữ liệu vào form chỉnh sửa
    document.getElementById("editHomestayId").value = homestay.id;
    document.getElementById("editName").value = homestay.name;
    document.getElementById("editStreet").value = homestay.street;
    document.getElementById("editWard").value = homestay.ward;
    document.getElementById("editDistrict").value = homestay.district;
    document.getElementById("editDescription").value = homestay.description;
    document.getElementById("editContactInfo").value = homestay.contactInfo;

    // Hiển thị tab chỉnh sửa
    document
      .querySelectorAll(".tab-content")
      .forEach((tab) => (tab.style.display = "none"));
    document.getElementById("edit-homestay").style.display = "block";

    // Gắn submit handler
    const editForm = document.getElementById("edit-homestay-form");
    editForm.onsubmit = async function (e) {
      e.preventDefault();

      const updatedData = {
        name: document.getElementById("editName").value,
        street: document.getElementById("editStreet").value,
        ward: document.getElementById("editWard").value,
        district: document.getElementById("editDistrict").value,
        description: document.getElementById("editDescription").value,
        contactInfo: document.getElementById("editContactInfo").value,
      };

      try {
        const putRes = await fetch(
          `http://localhost:8080/homestay/api/homestays/${homestayId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          }
        );

        if (!putRes.ok) throw new Error("Không thể cập nhật homestay");

        const imageFiles = editedHomestayImages();
        if (imageFiles.length <= 0) console.log("vl");
        if (imageFiles.length > 0) {
          await editHomestayImages(homestayId, imageFiles, token);
        }

        alert("Cập nhật homestay thành công!");
        document.getElementById("edit-homestay").style.display = "none";
        // Ẩn tab chỉnh sửa homestay
        document.getElementById("edit-homestay").style.display = "none";

        // Gọi returnToDefault để hiển thị nội dung mặc định
        returnToDefault();

        // Xóa class active-tab khỏi tất cả các liên kết tab
        document
          .querySelectorAll(".tab-link")
          .forEach((link) => link.classList.remove("active-tab"));

        // Xóa class active-homestay khỏi tất cả các homestay-toggle
        document
          .querySelectorAll(".homestay-toggle")
          .forEach((toggle) => toggle.classList.remove("active-homestay"));

        // Đặt lại trạng thái submenu trong sidebar
        document
          .querySelectorAll(".sub-menu")
          .forEach((menu) => (menu.style.display = "none"));
        document.querySelector(".homestay-list").style.display = "none";
        const parentToggle = document.querySelector(".parent-toggle");
        if (parentToggle) {
          parentToggle.classList.remove("open");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật homestay:", error);
        alert("Không thể cập nhật homestay. Vui lòng thử lại.");
      }
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu homestay:", error);
    alert("Không thể tải dữ liệu homestay. Vui lòng thử lại sau.");
  }
}

async function fetchApprovedBookings() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("Không tìm thấy token.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/homestay/api/bookings/filter",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu từ server");
    }

    const bookings = await response.json();
    const tbody = document.getElementById("approved-booking-list");
    tbody.innerHTML = ""; // Xóa dữ liệu cũ

    bookings.forEach((booking) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${booking.homestayName}</td>
        <td>${booking.bookingId}</td>
        <td>${booking.roomId}</td>
        <td>${booking.userEmail}</td>
        <td>${booking.totalPrice.toLocaleString()} VND</td>
        <td>${formatDate(booking.checkInDate)}</td>
        <td>${formatDate(booking.checkOutDate)}</td>
        <td>${formatDate(booking.createdAt)}</td>
      `;

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi tải đơn đặt phòng đã duyệt:", error);
  }
}

// Format YYYY-MM-DD => DD/MM/YYYY
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

window.addHomestay = function () {
  const form = document.getElementById("add-homestay-form");

  if (!form) {
    console.error("Không tìm thấy form thêm homestay.");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const formData = getHomestayFormData();
      const token = localStorage.getItem("authToken");

      const res = await postHomestay(formData, token);
      const newHomestay = await res.json();

      const imageFiles = getHomestayImages();
      if (imageFiles.length > 0) {
        await uploadHomestayImages(newHomestay.id, imageFiles, token);
      }

      alert("Thêm homestay thành công!");
      resetHomestayForm();

      // Ẩn tất cả tab nội dung và xóa class active
      document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.remove("active");
        tab.style.display = "none";
      });

      // Hiển thị tab "Đang chờ phê duyệt"
      const pendingTab = document.getElementById("pending-approval-homestays");
      if (pendingTab) {
        pendingTab.classList.add("active");
        pendingTab.style.display = "block";
      }

      // Xóa class active-tab khỏi tất cả các liên kết tab
      document
        .querySelectorAll(".tab-link")
        .forEach((link) => link.classList.remove("active-tab"));

      // Thêm class active-tab cho liên kết "Đang chờ phê duyệt"
      const pendingTabLink = document.querySelector(
        '.tab-link[data-tab="pending-approval-homestays"]'
      );
      if (pendingTabLink) {
        pendingTabLink.classList.add("active-tab");
      }

      // Xóa class active-homestay khỏi các homestay-toggle (nếu có)
      document
        .querySelectorAll(".homestay-toggle")
        .forEach((toggle) => toggle.classList.remove("active-homestay"));

      // Tải danh sách homestay đang chờ phê duyệt
      fetchPendingHomestays();
    } catch (error) {
      console.error("Lỗi khi thêm homestay:", error);
      alert("Đã xảy ra lỗi khi thêm homestay.");
    }
  });
};

function getHomestayFormData() {
  const form = document.getElementById("add-homestay-form");

  return {
    name: form.name.value.trim(),
    street: form.street.value.trim(),
    ward: form.ward.value.trim(),
    district: form.district.value.trim(),
    description: form.description.value.trim(),
    contactInfo: form.contactInfo.value.trim(),
  };
}

// Lấy danh sách file ảnh từ input
function getHomestayImages() {
  const input = document.getElementById("homestay-images");
  return input.files;
}

function editedHomestayImages() {
  const input = document.getElementById("editHomestayImages");
  return input.files;
}

async function postHomestay(homestayData, token) {
  const res = await fetch("http://localhost:8080/homestay/api/homestays", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(homestayData),
  });
  if (!res.ok) throw new Error("Không thể thêm homestay");
  return res;
}

// Upload ảnh sau khi có homestayId
async function uploadHomestayImages(homestayId, images, token) {
  const formData = new FormData();
  formData.append("isPrimary", "");
  for (const file of images) {
    formData.append("file", file);
  }

  const res = await fetch(
    `http://localhost:8080/homestay/api/homestays/${homestayId}/images`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Lỗi khi upload ảnh");
}

async function editHomestayImages(homestayId, images, token) {
  const formData = new FormData();
  formData.append("isPrimary", "");
  for (const file of images) {
    formData.append("file", file);
  }

  const res = await fetch(
    `http://localhost:8080/homestay/api/homestays/${homestayId}/images`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Lỗi khi upload ảnh");
}

function resetHomestayForm() {
  document.getElementById("add-homestay-form").reset();
  document.getElementById("homestay-preview-container").innerHTML = "";
}

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
      if (!response.ok) {
        return response.json().then((errorData) => {
          const msg = errorData.message || "Lỗi không xác định";
          throw new Error(msg);
        });
      }
      return response.json();
    })
    .then((data) => {
      alert("Đã duyệt thành công!");
      loadPendingBookings();
    })
    .catch((error) => {
      console.error("Lỗi khi duyệt:", error);
      alert("Lỗi khi duyệt: " + error.message);
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
      loadPendingBookings();
    })
    .catch((error) => {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi reject booking");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  window.addHomestay();
});

window.addEventListener("DOMContentLoaded", function () {
  const tabLink = document.querySelector(
    'a.tab-link[data-tab="pending-approval-homestays"]'
  );

  if (tabLink) {
    tabLink.addEventListener("click", function (e) {
      e.preventDefault();
      fetchPendingHomestays();
    });
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const tabLink = document.querySelector(
    '.tab-link[data-tab="approved-bookings"]'
  );
  if (tabLink) {
    tabLink.addEventListener("click", function (event) {
      event.preventDefault();
      fetchApprovedBookings();
    });
  }
});

document.querySelectorAll(".btn-edit").forEach((btn) => {
  btn.addEventListener("click", async function () {
    const roomId = this.dataset.id;
    const token = localStorage.getItem("authToken");

    const res = await fetch(
      `http://localhost:8080/homestay/api/rooms/${roomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();

    document.getElementById("editRoomId").value = data.roomId;
    document.getElementById("editPrice").value = data.price;
    document.querySelectorAll("input[name='editRoomType']").forEach((el) => {
      el.checked = el.value === data.roomType;
    });

    const selectedFacilities = data.features?.split(", ") || [];
    document.querySelectorAll("input[name='editFacilities']").forEach((el) => {
      el.checked = selectedFacilities.includes(el.value);
    });

    document.getElementById("edit-preview-container").innerHTML = "";
    document
      .querySelectorAll(".tab-content")
      .forEach((t) => (t.style.display = "none"));
    document.getElementById("edit-room").style.display = "block";
  });
});

document
  .getElementById("save-room-changes")
  .addEventListener("click", async function () {
    const roomId = document.getElementById("editRoomId").value;
    const price = document.getElementById("editPrice").value;
    const roomType = document.querySelector(
      "input[name='editRoomType']:checked"
    )?.value;
    const availability =
      document.getElementById("editRoomAvailability").value === "true"; // Chuyển thành boolean
    const features = Array.from(
      document.querySelectorAll("input[name='editFacilities']:checked")
    )
      .map((el) => el.value)
      .join(", ");
    const imageFile = document.getElementById("editImage").files[0];
    const homestayId = document.querySelector(
      "#edit-room input[name='homestayId']"
    ).value;

    if (!roomType || !price) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiểm tra availability hợp lệ
    if (
      !["true", "false"].includes(
        document.getElementById("editRoomAvailability").value
      )
    ) {
      alert("Vui lòng chọn trạng thái phòng hợp lệ!");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      // Ghi log để kiểm tra dữ liệu gửi đi
      console.log("Dữ liệu gửi API:", {
        roomType,
        price,
        features,
        availability,
      });

      const res = await fetch(
        `http://localhost:8080/homestay/api/rooms/${roomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roomType,
            price,
            features,
            availability,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể cập nhật phòng");
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const imgRes = await fetch(
          `http://localhost:8080/homestay/api/rooms/${roomId}/images`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!imgRes.ok) throw new Error("Lỗi khi upload ảnh phòng");
      }

      alert("Cập nhật thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi cập nhật phòng:", error);
      alert("Không thể cập nhật phòng: " + error.message);
    }
  });
