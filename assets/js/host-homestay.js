window.onload = function () {
    const homestayList = document.querySelector(".homestay-list");
    const token = localStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const hostId = decodedToken.host_id;

    // Load danh sách homestay
    fetch(`http://localhost:8080/homestay/api/homestays/host/${hostId}`, {
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
                        <li>
                            <a href="#" class="tab-link" data-tab="view-all-pending-room" data-hid="${homestay.id}">
                                Phòng đang chờ duyệt
                            </a>
                        </li>
                    </ul>
                `;
                li.querySelector(".homestay-toggle").addEventListener("click", (e) => {
                    e.preventDefault();

                    // Gỡ active-tab khỏi tất cả tab trước
                    document.querySelectorAll(".tab-link, .homestay-toggle, .parent-toggle").forEach((el) => el.classList.remove("active-tab"));

                    // Ẩn tất cả submenu khác
                    document.querySelectorAll(".homestay-list .sub-menu").forEach((menu) => {
                        if (menu !== li.querySelector(".sub-menu")) {
                            menu.style.display = "none";
                        }
                    });

                    // Toggle submenu hiện tại
                    const sm = li.querySelector(".sub-menu");
                    const isShown = sm.style.display === "block";
                    sm.style.display = isShown ? "none" : "block";

                    // Nếu đang mở, in đậm homestay name và parent-toggle
                    if (!isShown) {
                        e.target.classList.add("active-tab");
                        const parentToggle = document.querySelector(".parent-toggle");
                        parentToggle.classList.add("active-tab");

                        // Tự động click tab con đầu tiên
                        const firstTab = sm.querySelector(".tab-link");
                        if (firstTab) firstTab.click();
                    }
                });

                homestayList.appendChild(li);
            });
        })
        .catch((err) => console.error("Lỗi khi load homestay:", err));

    // Xử lý sự kiện click vào tab-link
    document.addEventListener("click", function (e) {
        const clickedTab = e.target.closest(".tab-link");
        if (!clickedTab) return;
        e.preventDefault();

        // Gỡ active-tab khỏi tất cả tab
        document.querySelectorAll(".tab-link, .homestay-toggle, .parent-toggle").forEach((el) => el.classList.remove("active-tab"));

        // Đánh dấu tab được click là active
        clickedTab.classList.add("active-tab");

        // Đánh dấu các cấp cha: homestay-toggle và parent-toggle
        const subMenu = clickedTab.closest(".sub-menu");
        if (subMenu) {
            const homestayToggle = subMenu.previousElementSibling;
            if (homestayToggle) {
                homestayToggle.classList.add("active-tab");

                // Tiếp tục truy ngược lên .parent-toggle nếu có
                const parentLi = homestayToggle.closest("li");
                const parentToggle = parentLi?.parentElement?.closest("li")?.querySelector(".parent-toggle");
                if (parentToggle) {
                    parentToggle.classList.add("active-tab");
                }
            }
        }

        // Xử lý nội dung tab
        const tabId = clickedTab.dataset.tab;
        const homestayId = clickedTab.dataset.hid;

        document.querySelectorAll(".tab-content").forEach((tc) => (tc.style.display = "none"));

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
                renderBookingTable(bookings);
            }
        }
    });

    function showRoomList(homestayId) {
        const viewTab = document.getElementById("view-all-room");
        viewTab.style.display = "block";

        fetch(`http://localhost:8080/homestay/api/rooms/valid-homestay/${homestayId}`)
            .then((res) => res.json())
            .then((rooms) => {
                const tbody = viewTab.querySelector(".room-table tbody");
                tbody.innerHTML = "";
                if (!rooms.length) {
                    tbody.innerHTML = '<tr><td colspan="5">Không có phòng nào.</td></tr>';
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
                            <button class="btn btn-view" data-id="${r.roomId}">Xem</button>
                            <button class="btn btn-edit" data-id="${r.roomId}">Sửa</button>
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

    function showPendingRoomList(homestayId) {
        const viewTab = document.getElementById("view-all-pending-room");
        viewTab.style.display = "block";

        fetch(`http://localhost:8080/homestay/api/rooms/pending-homestay/${homestayId}`)
            .then((res) => res.json())
            .then((rooms) => {
                const tbody = viewTab.querySelector(".room-table tbody");
                tbody.innerHTML = "";
                if (!rooms.length) {
                    tbody.innerHTML = '<tr><td colspan="5">Không có phòng nào.</td></tr>';
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
                            <button class="btn btn-view" data-id="${r.roomId}">Xem</button>
                            <button class="btn btn-edit" data-id="${r.roomId}">Sửa</button>
                            <button class="btn btn-delete" data-id="${r.roomId}">Xóa</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch((err) => console.error("Lỗi load phòng:", err));
    }

    function renderBookingTable(data) {
        const tbody = document.querySelector("#manage-bookings tbody");
        tbody.innerHTML = "";

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">Không có đơn đặt phòng nào.</td></tr>';
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
                    <button class="btn btn-approve">Phê duyệt</button>
                    <button class="btn btn-reject">Từ chối</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.returnToDefault = function () {
        document.querySelectorAll(".tab-content").forEach((tc) => (tc.style.display = "none"));
        document.getElementById("default-content").style.display = "block";
        document.querySelectorAll(".tab-link, .homestay-toggle, .parent-toggle").forEach((el) => el.classList.remove("active-tab"));
    };

    // Xử lý thêm phòng
    document.getElementById("submit-room").addEventListener("click", function () {
        const roomType = document.querySelector("input[name='RoomType']:checked")?.value;
        const price = document.getElementById("Price").value;
        const featuresEls = document.querySelectorAll("input[name='Facilities']:checked");
        const features = Array.from(featuresEls)
            .map((el) => el.value)
            .join(", ");

        if (!roomType || !price || !features) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        const homestayId = document.querySelector("#add-room input[name='homestayId']").value;

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
            })
            .catch((error) => {
                console.error("Lỗi:", error);
            });
    });
};
