const carousel = document.querySelector(".carousel");
const slides = document.querySelectorAll(".slide");
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");
let slideIndex = 0;
const slidesPerMove = 5;

function nextSlides(n) {
    slideIndex += n;
    if (slideIndex >= slides.length - 1) {
        slideIndex = slides.length - 1;
    }
    updateButtonsVisibility();
    updateCarousel();
}

function prevSlides(n) {
    slideIndex -= n;
    if (slideIndex < 0) {
        slideIndex = 0;
    }
    updateButtonsVisibility();
    updateCarousel();
}

function updateCarousel() {
    const slideWidth = slides[0].offsetWidth + 10;
    let translateX = -slideIndex * slideWidth;

    const carouselWidth = carousel.offsetWidth;
    const lastSlideWidth = slides[slides.length - 1].offsetWidth;
    const remainingSpace = carouselWidth - lastSlideWidth;

    if (slideIndex === slides.length - 1) {
        translateX = -(slideIndex * slideWidth - remainingSpace);
    }

    carousel.style.transform = `translateX(${translateX}px)`;
}

function updateButtonsVisibility() {
    if (slideIndex === 0) {
        prevButton.style.display = "none";
    } else {
        prevButton.style.display = "block";
    }

    if (slideIndex >= slides.length - 6) {
        nextButton.style.display = "none";
    } else {
        nextButton.style.display = "block";
    }
}

updateButtonsVisibility();

// Popup login/register functionality
function openPopup(tab) {
    document.getElementById("popup").style.display = "flex";
    switchTab(tab);
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function switchTab(tab) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const registerTab = document.querySelector(".tab-btn:nth-child(1)");
    const loginTab = document.querySelector(".tab-btn:nth-child(2)");

    if (tab === "login") {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
    } else {
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
    }
}

// Event listeners for login and signup buttons
document.querySelector(".login").addEventListener("click", function () {
    openPopup("login");
});

document.querySelector(".signup").addEventListener("click", function () {
    openPopup("register");
});
