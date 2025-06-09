// search-box.js

window.onload = function () {
  const searchButton = document.querySelector(".search-box .search-button");

  if (!searchButton) return;

  searchButton.addEventListener("click", () => {
    const locationInput = document.querySelector(".search-box .search-field");
    const checkInInput = document.querySelector(".search-box .date-start");
    const checkOutInput = document.querySelector(".search-box .date-end");
    const roomTypeSelect = document.querySelector(".room-type-select");

    const location = locationInput?.value.trim() || "";
    const checkIn = checkInInput?.value || "";
    const checkOut = checkOutInput?.value || "";
    const roomType = roomTypeSelect?.value || "";

    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (checkIn) params.append("checkIn", formatToISO(checkIn));
    if (checkOut) params.append("checkOut", formatToISO(checkOut));
    if (roomType) params.append("roomType", roomType);

    window.location.href = `homestay-list.html?${params.toString()}`;
  });

  function formatToISO(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }
};
