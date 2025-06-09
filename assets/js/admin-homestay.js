window.onload = function () {
  const token = localStorage.getItem("authToken");

  // Dữ liệu giả cho danh sách doanh nghiệp và homestay
  let mockHosts = [
    {
      id: "H001",
      name: "Công ty Du lịch Biển Xanh",
      status: "ACTIVE",
      homestays: [
        {
          id: "HS001",
          name: "Homestay Biển Xanh 1",
          address: "123 Đường Bãi Dài, Phú Quốc",
          status: "ACTIVE",
        },
        {
          id: "HS002",
          name: "Homestay Biển Xanh 2",
          address: "456 Đường Trần Hưng Đạo, Đà Nẵng",
          status: "LOCKED",
        },
      ],
    },
    {
      id: "H002",
      name: "Công ty Du lịch Biển Xanh",
      email: "contact@blueocean.com",
      status: "ACTIVE",
      homestays: [
        {
          id: "HA001",
          name: "Homestay Biển Xanh 1",
          address: "123 Đường Bãi Dài, Phú Quốc",
          status: "ACTIVE",
        },
        {
          id: "HA002",
          name: "Homestay Biển Xanh 2",
          address: "456 Đường Trần Hưng Đạo, Đà Nẵng",
          status: "LOCKED",
        },
      ],
    },
    {
      id: "H003",
      name: "Công ty Du lịch Biển Xanh",
      email: "contact@blueocean.com",
      status: "ACTIVE",
      homestays: [
        {
          id: "HB001",
          name: "Homestay Biển Xanh 1",
          address: "123 Đường Bãi Dài, Phú Quốc",
          status: "ACTIVE",
        },
        {
          id: "HB002",
          name: "Homestay Biển Xanh 2",
          address: "456 Đường Trần Hưng Đạo, Đà Nẵng",
          status: "LOCKED",
        },
      ],
    },
    {
      id: "H004",
      name: "Công ty Lữ hành Núi Rừng",
      email: "info@mountaintravel.com",
      status: "LOCKED",
      homestays: [
        {
          id: "HC003",
          name: "Homestay Núi Rừng 1",
          address: "789 Đường Trường Sa, Đà Lạt",
          status: "ACTIVE",
        },
      ],
    },
    {
      id: "H005",
      name: "Công ty Homestay Sông Nước",
      email: "contact@riverstay.com",
      status: "ACTIVE",
      homestays: [],
    },
    {
      id: "H006",
      name: "Công ty Lữ hành Núi Rừng",
      email: "info@mountaintravel.com",
      status: "LOCKED",
      homestays: [
        {
          id: "HD001",
          name: "Homestay Núi Rừng 1",
          address: "789 Đường Trường Sa, Đà Lạt",
          status: "ACTIVE",
        },
      ],
    },
    {
      id: "H007",
      name: "Công ty Lữ hành Núi Rừng",
      email: "info@mountaintravel.com",
      status: "LOCKED",
      homestays: [
        {
          id: "HS005",
          name: "Homestay Núi Rừng 1",
          address: "789 Đường Trường Sa, Đà Lạt",
          status: "ACTIVE",
        },
      ],
    },
  ];

  // Dữ liệu giả cho danh sách người dùng
  let mockUsers = [
    {
      id: "U001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      status: "ACTIVE",
      createdAt: "2025-01-01T10:00:00",
    },
    {
      id: "U002",
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      status: "LOCKED",
      createdAt: "2025-02-01T12:00:00",
    },
    {
      id: "U003",
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      status: "ACTIVE",
      createdAt: "2025-03-01T15:00:00",
    },
  ];

  // Lưu trạng thái toggle của các host
  let toggleStates = {};

  document.querySelectorAll(".tab-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelectorAll(".tab-content").forEach((tc) => {
        tc.classList.remove("active");
      });
      document.querySelectorAll(".tab-link").forEach((l) => {
        l.classList.remove("active-tab");
      });

      const tabId = this.dataset.tab;
      document.getElementById(tabId).classList.add("active");
      this.classList.add("active-tab");

      if (tabId === "tab-approve-business") {
        loadPendingHomestays();
      } else if (tabId === "tab-manage-company") {
        loadHostsAndHomestays();
      } else if (tabId === "tab-manage-users") {
        loadUsers();
      }
    });
  });

  // Hàm tải danh sách doanh nghiệp và homestay
  async function loadHostsAndHomestays() {
    const token = localStorage.getItem("authToken");
    const container = document.getElementById("host-container");
    container.innerHTML = "";

    try {
      const userRes = await fetch(
        "http://localhost:8080/homestay/api/users/hosts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!userRes.ok) throw new Error("Không thể tải danh sách hosts");
      const hosts = await userRes.json();

      if (!hosts.length) {
        container.innerHTML =
          "<tr><td colspan='4'>Không có doanh nghiệp nào.</td></tr>";
        return;
      }

      for (const host of hosts) {
        const card = document.createElement("div");
        card.className = "host-card";

        let homestaysHtml = "<p>Đang tải homestay...</p>";
        card.innerHTML = `
        <div class="host-info">
          <div class="host-details">
            <div>ID ${host.id}</div>
            <div>${host.username}</div>
          </div>
          <div class="host-actions">
            <button class="btn btn-expand" onclick="toggleHomestays('${host.id}')">Xem Homestay</button>
          </div>
        </div>
        <div id="homestays-${host.id}" class="homestay-list">${homestaysHtml}</div>
      `;

        container.appendChild(card);

        try {
          const hsRes = await fetch(
            `http://localhost:8080/homestay/api/homestays/host/${host.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const homestays = await hsRes.json();

          const hsContainer = card.querySelector(`#homestays-${host.id}`);
          if (!homestays.length) {
            hsContainer.innerHTML = "<p>Không có homestay nào.</p>";
          } else {
            hsContainer.innerHTML = homestays
              .map(
                (h) => `
                <div class="homestay-item">
                  <div class="homestay-details">
                    <div>ID ${h.id}</div>
                    <div>${h.name}</div>
                    <div>${h.street}, ${h.ward}, ${h.district}</div>
                  </div>
                  <div class="homestay-actions">
                    <button class="btn btn-view" onclick="window.location.href='homestay.html?id=${
                      h.id
                    }'" ${
                  host.status === "LOCKED" ? "disabled" : ""
                }>Xem chi tiết</button>
                    <button class="btn btn-toggle" onclick="toggleHomestayStatus('${
                      h.id
                    }', '${h.approveStatus}')" ${
                  host.status === "LOCKED" ? "disabled" : ""
                }>${
                  h.approveStatus === "ACCEPTED" ? "Khóa" : "Mở khóa"
                }</button>
                  </div>
                </div>
              `
              )
              .join("");
          }
        } catch (err) {
          card.querySelector(`#homestays-${host.id}`).innerHTML =
            "<p>Lỗi khi tải homestay.</p>";
        }
      }
    } catch (err) {
      container.innerHTML = `<tr><td colspan='4'>Lỗi: ${err.message}</td></tr>`;
    }
  }

  // Hàm tải danh sách người dùng
  function loadUsers() {
    const container = document.getElementById("user-container");
    container.innerHTML = "";

    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/homestay/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách người dùng.");
        }
        return response.json();
      })
      .then((users) => {
        if (!users.length) {
          container.innerHTML = "<p>Không có người dùng nào.</p>";
          return;
        }

        users.forEach((user) => {
          const card = document.createElement("div");
          card.className = "host-card";
          card.innerHTML = `
          <div class="host-info">
            <div class="host-details">
              <div>ID ${user.id}</div>
              <div>${user.username}</div>
            </div>
            <div class="host-actions">
              <button class="btn btn-view" onclick='openCommonPopup("user", ${JSON.stringify(
                {
                  id: user.id,
                  name: user.username,
                  email: user.email,
                }
              )})'>Xem chi tiết</button>
            </div>
          </div>
        `;
          container.appendChild(card);
        });
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        container.innerHTML = `<p>${error.message}</p>`;
      });
  }

  // Hàm mở rộng/thu gọn danh sách homestay
  window.toggleHomestays = function (hostId) {
    const homestayList = document.getElementById(`homestays-${hostId}`);
    const expandButton = document.querySelector(
      `button[onclick="toggleHomestays('${hostId}')"]`
    );
    const isExpanded = homestayList.classList.contains("active");

    toggleStates[hostId] = !isExpanded;

    if (!isExpanded) {
      homestayList.classList.add("active");
      expandButton.textContent = "Thu gọn";
    } else {
      homestayList.classList.remove("active");
      expandButton.textContent = "Xem Homestay";
    }
  };

  // Hàm khóa/mở khóa doanh nghiệp
  // window.toggleHostStatus = function (hostId, currentStatus) {
  //   const newStatus = currentStatus === "ACTIVE" ? "LOCKED" : "ACTIVE";
  //   mockHosts = mockHosts.map((host) => {
  //     if (host.id === hostId) {
  //       host.status = newStatus;
  //       if (newStatus === "LOCKED") {
  //         host.homestays = host.homestays.map((h) => ({
  //           ...h,
  //           status: "LOCKED",
  //         }));
  //       }
  //     }
  //     return host;
  //   });
  //   const currentState = toggleStates[hostId];
  //   loadHostsAndHomestays();
  //   if (currentState) {
  //     const homestayList = document.getElementById(`homestays-${hostId}`);
  //     const expandButton = document.querySelector(
  //       `button[onclick="toggleHomestays('${hostId}')"]`
  //     );
  //     homestayList.classList.add("active");
  //     expandButton.textContent = "Thu gọn";
  //     toggleStates[hostId] = true;
  //   }
  // };

  // Hàm khóa/mở khóa homestay
  window.toggleHomestayStatus = async function toggleHomestayStatus(
    homestayId,
    currentStatus
  ) {
    const token = localStorage.getItem("authToken");

    const url =
      currentStatus === "ACCEPTED"
        ? `http://localhost:8080/homestay/api/homestays/admin/reject/${homestayId}`
        : `http://localhost:8080/homestay/api/homestays/admin/pending/${homestayId}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể cập nhật trạng thái homestay");

      await loadHostsAndHomestays(); // refresh lại danh sách
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái: " + err.message);
    }
  };

  // Hàm khóa/mở khóa người dùng
  window.toggleUserStatus = function (userId, currentStatus) {
    const newStatus = currentStatus === "ACTIVE" ? "LOCKED" : "ACTIVE";
    mockUsers = mockUsers.map((user) =>
      user.id === userId ? { ...user, status: newStatus } : user
    );
    loadUsers();
  };

  function loadPendingHomestays() {
    const container = document.getElementById("homestay-request-container");
    container.innerHTML = "";

    fetch("http://localhost:8080/homestay/api/homestays/pending", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || !data.length) {
          container.innerHTML = "<p>Không có yêu cầu nào.</p>";
          return;
        }
        data.forEach((h) => {
          const address = [h.street, h.ward, h.district]
            .filter(Boolean)
            .join(", ");
          const card = document.createElement("div");
          card.className = "host-card";
          card.innerHTML = `
          <div class="host-info">
            <div class="host-details">
              <div>ID ${h.id}</div>
              <div>${h.name}</div>
            </div>
            <div class="host-actions">
              <button class="btn btn-view" onclick='openCommonPopup("business", ${JSON.stringify(
                {
                  name: h.name,
                  address,
                  email: h.contactInfo,
                  note: new Date(h.createdAt).toLocaleString(),
                }
              )})'>Xem chi tiết</button>
              <button class="btn btn-approve" onclick="approveHomestay(${
                h.id
              })">Phê duyệt</button>
              <button class="btn btn-reject" onclick="rejectHomestay(${
                h.id
              })">Từ chối</button>
            </div>
          </div>
        `;
          container.appendChild(card);
        });
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách:", err);
        container.innerHTML = "<p>Lỗi khi tải dữ liệu.</p>";
      });
  }
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

  window.returnToDefault = function () {
    document
      .querySelectorAll(".tab-content")
      .forEach((tc) => tc.classList.remove("active"));
    document.getElementById("default-content").classList.add("active");
    document
      .querySelectorAll(".tab-link")
      .forEach((l) => l.classList.remove("active-tab"));
    document.querySelectorAll(".homestay-list").forEach((list) => {
      list.classList.remove("active");
    });
    document.querySelectorAll(".btn-expand").forEach((btn) => {
      btn.textContent = "Xem Homestay";
    });
  };
};
