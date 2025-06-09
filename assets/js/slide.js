// assets/js/slide.js
function initializeSlide() {
  const tabs = document.querySelectorAll(".tab");
  const propertyGrids = document.querySelectorAll(".property-grid");
  const viewMoreText = document.getElementById("view-more-text");

  function formatPrice(price) {
    return price.toLocaleString("vi-VN");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const selectedLocation = this.getAttribute("data-location");

      propertyGrids.forEach((grid) => {
        const gridLocation = grid.getAttribute("data-location");
        if (gridLocation === selectedLocation) {
          grid.style.display = "grid";
          grid.innerHTML = "";

          fetch(
            `http://localhost:8080/homestay/api/homestays/slide/${selectedLocation}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.length === 0) {
                grid.innerHTML =
                  "<p>Hiện chưa có chỗ nghỉ nào ở khu vực này.</p>";
                return;
              }

              data.forEach(async (item) => {
                let primaryImageUrl = "assets/img/default-thumbnail.webp";

                try {
                  const res = await fetch(
                    `http://localhost:8080/homestay/api/homestays/${item.id}/images/primary`
                  );
                  if (res.ok) {
                    const json = await res.json();
                    primaryImageUrl = json.primaryImageUrl;
                  }
                } catch (error) {
                  console.error("Không lấy được ảnh chính:", error);
                }

                const cardHTML = `
                  <div class="property-card result-card" data-id="${item.id}">
                    <div class="rating">${item.surfRating ?? "?"}</div>
                    <img src="${primaryImageUrl}" alt="${item.name}" />
                    <div class="property-details">
                      <h3>${item.name}</h3>
                      <span class="stars">${item.surfRating ?? "?"}/5 ★</span>
                      <div class="property-info">
                        <div class="property-location">
                          <i class="ti-location-pin"></i>${item.street}, ${item.ward}
                        </div>
                      </div>
                    </div>
                  </div>
                `;

                grid.insertAdjacentHTML("beforeend", cardHTML);
                const insertedCard = grid.querySelector(
                  `.result-card[data-id="${item.id}"]`
                );
                insertedCard.addEventListener("click", () => {
                  window.location.href = `homestay.html?id=${item.id}`;
                });
              });
            })
            .catch((err) => {
              grid.innerHTML =
                "<p>Lỗi khi tải dữ liệu homestay. Vui lòng thử lại.</p>";
              console.error(err);
            });
        } else {
          grid.style.display = "none";
        }
      });

      viewMoreText.textContent = this.textContent.trim();
    });
  });

  if (tabs.length > 0) {
    tabs[0].click();
  }
}

export { initializeSlide };
