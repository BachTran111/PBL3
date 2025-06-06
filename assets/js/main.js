// assets/js/main.js
// import { openPopup, closePopup, setupPopupEventListeners } from "./popup-login.js";
// import { login, checkLoginStatus } from "./login.js";
// import { initializeCarousel } from "./carousel.js";
// import { setupTabsLocation } from "./tabs-location.js";
// import { initializeSlide } from "./slide.js";
// import { showHidePassword } from "./show-hide-password.js";
// import { setupValidation } from "./register.js";
// import { fetchRooms } from "./room-image.js";
// import { fetchHomestayImages } from "./fetch-homestay-img.js";

// window.addEventListener("load", () => {
//     setupPopupEventListeners();
//     login();
//     checkLoginStatus();
//     initializeCarousel();
//     setupTabsLocation();
//     initializeSlide();
//     showHidePassword();
//     setupValidation();

//     const urlParams = new URLSearchParams(window.location.search);
//     const homestayId = urlParams.get("id"); // Lấy homestayId từ URL

//     if (homestayId) {
//     fetchRooms(homestayId); // Gọi hàm để fetch phòng từ API
//     fetchHomestayImages(homestayId); // Gọi hàm để fetch ảnh homestay từ API
//     } else {
//     console.log("Không tìm thấy ID của homestay.");
//     }
// });

import {
  openPopup,
  closePopup,
  setupPopupEventListeners,
} from "./popup-login.js";
import { login, checkLoginStatus } from "./login.js";
import { initializeCarousel } from "./carousel.js";
import { setupTabsLocation } from "./tabs-location.js";
import { initializeSlide } from "./slide.js";
import { showHidePassword } from "./show-hide-password.js";
import { setupValidation } from "./register.js";

window.addEventListener("load", () => {
  setupPopupEventListeners();
  checkLoginStatus();
  login();
  initializeCarousel();
  setupTabsLocation();
  initializeSlide();
  showHidePassword();
  setupValidation();
});
