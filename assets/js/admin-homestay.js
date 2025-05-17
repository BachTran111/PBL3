window.onload = function () {
  const token = localStorage.getItem("authToken");

  // 1. Tất cả các tab-link
  document.querySelectorAll(".tab-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Ẩn tất cả tab-content
      document.querySelectorAll(".tab-content").forEach((tc) => {
        tc.classList.remove("active");
      });
      // Bỏ highlight tất cả tab
      document.querySelectorAll(".tab-link").forEach((l) => {
        l.classList.remove("active-tab");
      });

      // Hiển thị tab được chọn + highlight link
      const tabId = this.dataset.tab;
      document.getElementById(tabId).classList.add("active");
      this.classList.add("active-tab");

      // Nếu là tab-approve-business thì tải dữ liệu
      if (tabId === "tab-approve-business") {
        loadPendingHomestays();
      }
    });
  });

  // Hàm load dữ liệu homestay pending
  function loadPendingHomestays() {
    const tbody = document.getElementById("homestay-request-body");
    tbody.innerHTML = "";

    fetch("http://localhost:8080/homestay/api/homestays/pending", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || !data.length) {
          tbody.innerHTML = `<tr><td colspan="4">Không có yêu cầu nào.</td></tr>`;
          return;
        }
        data.forEach((h) => {
          const address = [h.street, h.ward, h.district]
            .filter(Boolean)
            .join(", ");
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${h.id}</td>
            <td>${h.name}</td>
            <td>
              <button class="btn btn-view"
                onclick='openCommonPopup("business", ${JSON.stringify({
                  name: h.name,
                  address,
                  email: h.contactInfo,
                  note: new Date(h.createdAt).toLocaleString(),
                })})'>
                Xem chi tiết
              </button>
            </td>
            <td>
              <button class="btn btn-approve" onclick="approveHomestay(${
                h.id
              })">Phê duyệt</button>
              <button class="btn btn-reject" onclick="rejectHomestay(${
                h.id
              })">Từ chối</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách:", err);
        tbody.innerHTML = `<tr><td colspan="4">Lỗi khi tải dữ liệu.</td></tr>`;
      });
  }

  // Hàm đóng về default
  window.returnToDefault = function () {
    document
      .querySelectorAll(".tab-content")
      .forEach((tc) => tc.classList.remove("active"));
    document.getElementById("default-content").classList.add("active");
    document
      .querySelectorAll(".tab-link")
      .forEach((l) => l.classList.remove("active-tab"));
  };

  // Hàm phê duyệt
  window.approveHomestay = function (id) {
    fetch(`http://localhost:8080/homestay/api/homestays/admin/pending/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        alert("Đã phê duyệt");
        loadPendingHomestays();
      })
      .catch(() => alert("Phê duyệt thất bại"));
  };

  window.rejectHomestay = function (id) {
    fetch(`http://localhost:8080/homestay/api/homestays/admin/reject/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        alert("Đã kiểm duyệt");
        loadPendingHomestays();
      })
      .catch(() => alert("Phê duyệt thất bại"));
  };
};
