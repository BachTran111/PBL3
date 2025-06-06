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
            <td>${r.availability ? "Còn trống" : "Đang được sử dụng"}</td>
            <td>${r.roomStatus ? "Không có" : "Đang sửa chữa"}</td>
            <td>
              <button class="btn btn-edit"  data-id="${r.roomId}">Sửa</button>
              <button class="btn btn-delete" data-id="${r.roomId}">Xóa</button>
            </td>
          `;
          // sửa phòng
          tr.querySelector(".btn-edit").addEventListener(
            "click",
            async function () {
              const roomId = this.getAttribute("data-id");
              const token = localStorage.getItem("authToken");

              const res = await fetch(
                `http://localhost:8080/homestay/api/rooms/${roomId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const room = await res.json();

              document.getElementById("editRoomId").value = room.roomId;
              document.getElementById("editPrice").value = room.price;

              document
                .querySelectorAll("input[name='editRoomType']")
                .forEach((radio) => {
                  radio.checked = radio.value === room.roomType;
                });

              const selected = (room.features || "").split(", ");
              document
                .querySelectorAll("input[name='editFacilities']")
                .forEach((cb) => {
                  cb.checked = selected.includes(cb.value);
                });

              document.getElementById("edit-preview-container").innerHTML = "";
              document
                .querySelectorAll(".tab-content")
                .forEach((tab) => (tab.style.display = "none"));
              document.getElementById("edit-room").style.display = "block";
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
            <button class="btn btn-approve" data-id="${
              booking.bookingId
            }">Chấp nhận</button>
            <button class="btn btn-reject" data-id="${
              booking.bookingId
            }">Từ chối</button>
          </td>
        `;
        tableBody.appendChild(row);
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

  fetch("http://localhost:8080/homestay/api/homestays/my_pending", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const tbody = document.getElementById("pending-homestay-list");
      tbody.innerHTML = "";

      data.forEach((homestay) => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = homestay.name;

        const addressTd = document.createElement("td");
        addressTd.textContent = `${homestay.street}, ${homestay.ward}, ${homestay.district}`;

        const createdAtTd = document.createElement("td");
        createdAtTd.textContent = new Date(homestay.createdAt).toLocaleString();

        const actionTd = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.textContent = "Chỉnh sửa";
        editBtn.className = "edit-btn";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Hủy yêu cầu";
        cancelBtn.className = "cancel-btn";

        actionTd.appendChild(editBtn);
        actionTd.appendChild(cancelBtn);

        tr.appendChild(nameTd);
        tr.appendChild(addressTd);
        tr.appendChild(createdAtTd);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
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
    const features = Array.from(
      document.querySelectorAll("input[name='editFacilities']:checked")
    )
      .map((el) => el.value)
      .join(", ");
    const imageFile = document.getElementById("editImage").files[0];

    if (!roomType || !price) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const token = localStorage.getItem("authToken");

    await fetch(`http://localhost:8080/homestay/api/rooms/${roomId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roomType, price, features }),
    });

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      await fetch(`http://localhost:8080/homestay/api/rooms/${roomId}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }

    alert("Cập nhật thành công!");
    document
      .querySelectorAll(".tab-content")
      .forEach((tab) => (tab.style.display = "none"));
    document.getElementById("view-all-room").style.display = "block";
    document.getElementById("edit-room").style.display = "none";
  });
