// assets/js/room-list.js

window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);

  // --- TICK CHECKBOX ROOM TYPE ---
  const roomTypeParam = urlParams.get("roomType");
  if (roomTypeParam) {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"][data-filter="roomType"]'
    );
    checkboxes.forEach((checkbox) => {
      if (checkbox.value === roomTypeParam) {
        checkbox.checked = true;
      }
    });
  }

  // --- ĐIỀN LOCATION ---
  const locationParam = urlParams.get("location");
  if (locationParam) {
    const locationInput = document.querySelector(
      'input[data-filter="location"]'
    );
    if (locationInput) {
      locationInput.value = locationParam;
    }
  }

  // --- ĐIỀN CHECK-IN ---
  const checkInParam = urlParams.get("checkIn");
  if (checkInParam) {
    const checkInInput = document.querySelector('input[data-filter="checkIn"]');
    if (checkInInput) {
      checkInInput.value = formatToDDMMYYYY(checkInParam);
    }
  }

  // --- ĐIỀN CHECK-OUT ---
  const checkOutParam = urlParams.get("checkOut");
  if (checkOutParam) {
    const checkOutInput = document.querySelector(
      'input[data-filter="checkOut"]'
    );
    if (checkOutInput) {
      checkOutInput.value = formatToDDMMYYYY(checkOutParam);
    }
  }

  await loadHomestaysWithFilters();

  // --- HÀM CHUYỂN TỪ YYYY-MM-DD VỀ DD/MM/YYYY ---
  function formatToDDMMYYYY(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }
};

const resultsContainer = document.querySelector(".results");

// Tạo pagination container
const paginationContainer = document.createElement("div");
paginationContainer.classList.add("pagination");
resultsContainer.after(paginationContainer);

// Lấy filter + reload trang khi baasm filter mới
const filterInputs = document.querySelectorAll("[data-filter]");
filterInputs.forEach((input) => {
  input.addEventListener("change", () => {
    currentPage = 1;
    loadHomestaysWithFilters();
  });
});

//Gom mấy filter lại
function collectFilters() {
  const params = {};

  filterInputs.forEach((input) => {
    const key = input.dataset.filter;
    const val = input.value.trim();

    // Xử lý khác nhau giữa checkbox/radio và các input khác
    if (input.type === "checkbox" || input.type === "radio") {
      if (!input.checked) return; // Bỏ qua nếu không checked
    } else {
      if (!val) return; // Bỏ qua nếu giá trị rỗng (date, text...)
    }

    switch (key) {
      case "price":
        const [min, max] = val.split("-").map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          params.priceFrom = Math.min(params.priceFrom ?? min, min);
          params.priceTo = Math.max(params.priceTo ?? max, max);
        }
        break;

      case "roomType":
        if (!params.roomType || !params.roomType.includes(val)) {
          params.roomType = params.roomType ? params.roomType + "," + val : val;
        }
        break;

      case "features":
        if (!params.features || !params.features.includes(val)) {
          params.features = params.features ? params.features + "," + val : val;
        }
        break;

      case "surfRating":
        // Chỉ giữ rating cao nhất
        params.surfRating = Math.max(params.surfRating ?? 0, Number(val));
        break;

      case "checkIn":
        params.checkInDate = val.split("/").reverse().join("-");
        break;

      case "checkOut":
        params.checkOutDate = val.split("/").reverse().join("-");
        break;

      case "location":
        params.location = val;
        break;
    }
  });

  console.log("Filter params:", params);
  return params;
}

function toQueryString(params) {
  return Object.entries(params)
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .join("&");
}

const endpoint = "http://localhost:8080/homestay/api/homestays/search";

const ITEMS_PER_PAGE = 10;

let currentPage = 1;
let allHomestays = [];

async function fetchPrimaryImageUrl(homestayId) {
  try {
    const res = await fetch(
      `http://localhost:8080/homestay/api/homestays/${homestayId}/images/primary`
    );
    if (!res.ok) throw new Error("No primary image");
    const data = await res.json();
    return data.primaryImageUrl;
  } catch (error) {
    console.error(
      "Không lấy được ảnh chính cho homestay ID:",
      homestayId,
      error
    );
    return "assets/img/default-thumbnail.webp"; // fallback ảnh mặc định
  }
}

async function renderPage(page) {
  resultsContainer.innerHTML = "";

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentItems = allHomestays.slice(start, end);

  const checkInDate = document.querySelector(".date-start").value;
  const checkOutDate = document.querySelector(".date-end").value;

  for (const item of currentItems) {
    const primaryImageUrl = await fetchPrimaryImageUrl(item.id);

    const cardHTML = `
      <div class="result-card" data-id=${item.id}>
        <img src="${primaryImageUrl}" alt="${item.name}" />
        <div class="result-details">
          <h3>${item.name}</h3>
          <div class="stars">${item.surfRating ?? "?"}/5 ★</div>
          <div class="location">
            <i class="ti-location-pin"></i> ${item.street ?? ""}, ${
      item.ward ?? ""
    }, ${item.district ?? ""}
          </div>
          <div class="amenities">
            ${item.description ?? "Chỗ nghỉ lý tưởng cho bạn."}
          </div>
        </div>
      </div>
    `;
    resultsContainer.insertAdjacentHTML("beforeend", cardHTML);
    const insertedCard = resultsContainer.querySelector(
      `.result-card[data-id="${item.id}"]`
    );
    insertedCard.addEventListener("click", () => {
      window.location.href = `homestay.html?id=${item.id}`;
      localStorage.setItem(
        "lastSearchDates",
        JSON.stringify({
          checkIn: checkInDate,
          checkOut: checkOutDate,
          autoSearch: true,
        })
      );
    });
  }
}

function renderPagination() {
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(allHomestays.length / ITEMS_PER_PAGE);

  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.addEventListener("click", () => {
      currentPage--;
      renderPage(currentPage);
      renderPagination();
    });
    paginationContainer.appendChild(prevBtn);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) {
      pageBtn.classList.add("active");
    }
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderPage(currentPage);
      renderPagination();
    });
    paginationContainer.appendChild(pageBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      currentPage++;
      renderPage(currentPage);
      renderPagination();
    });
    paginationContainer.appendChild(nextBtn);
  }
}

// Fetch dữ liệu homestay
// async function loadHomestays() {
//   try {
//     const response = await fetch(endpoint);
//     if (!response.ok) throw new Error("Lỗi khi truy cập API homestays");

//     const data = await response.json();
//     if (!Array.isArray(data) || data.length === 0) {
//       resultsContainer.innerHTML = "<p>Hiện chưa có homestay nào.</p>";
//       return;
//     }

//     allHomestays = data;
//     await renderPage(currentPage);
//     renderPagination();
//   } catch (error) {
//     console.error(error);
//     resultsContainer.innerHTML =
//       "<p>Lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>";
//   }

//   allHomestays = data;
//   await renderPage(currentPage);
//   renderPagination();
// }

async function loadHomestaysWithFilters() {
  const filters = collectFilters();
  const queryString = toQueryString(filters);
  const url = `${endpoint}?${queryString}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Lỗi khi truy cập API /search");

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      resultsContainer.innerHTML = "<p>Không tìm thấy homestay phù hợp.</p>";
      paginationContainer.innerHTML = "";
      return;
    }

    allHomestays = data;
    await renderPage(currentPage);
    renderPagination();
  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML =
      "<p>Lỗi khi tải dữ liệu lọc. Vui lòng thử lại sau.</p>";
    paginationContainer.innerHTML = "";
  }
}

// loadHomestaysWithFilters();
