// fetchRooms.js

export async function fetchRooms(homestayId) {
  try {
    // Gửi yêu cầu fetch danh sách các phòng từ API
    const response = await fetch(
      `http://localhost:8080/homestay/api/rooms/valid-homestay/${homestayId}`
    );
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.log("Không có phòng trong homestay này.");
      return;
    }

    // Lấy phần tử chứa các phòng sẽ được render
    const roomListSection = document.getElementById("room-list");
    roomListSection.innerHTML = ""; // Xóa các phòng cũ nếu có

    // Duyệt qua các phòng và tạo thẻ HTML
    for (const room of data) {
      // Fetch ảnh phòng cho mỗi phòng
      const imageResponse = await fetch(
        `http://localhost:8080/homestay/api/rooms/${room.roomId}/images`
      );
      const images = await imageResponse.json();

      // Kiểm tra nếu có ảnh cho phòng
      const roomImageUrl =
        images.length > 0 ? images[0].imageUrl : "assets/img/default-room.jpg"; // Dùng ảnh mặc định nếu không có ảnh

      const roomItem = document.createElement("div");
      roomItem.classList.add("room-item");

      const roomHTML = `
        <div class="room-img">
          <img src="${roomImageUrl}" alt="${room.roomType}" />
        </div>
        <div class="room-facilities">
        <div class="room-type"><h4>${room.roomType}</h4></div>
          <h4>Tiện nghi:</h4>
          <div class="room-info">
            <div class="facilities-list">
              <div class="facilities-item">
                ${room.features}
              </div>
            </div>
          </div>
        </div>
        <div class="room-price">
          <p class="price">${room.price.toLocaleString("vi-VN")} VND/đêm</p>
        </div>
        <div class="room-booking">
          <button class="btn-book-now" data-room-id="${
            room.roomId
          }">Đặt ngay</button>
        </div>
      `;

      roomItem.innerHTML = roomHTML;
      roomListSection.appendChild(roomItem);
    }
  } catch (error) {
    console.error("Lỗi khi lấy phòng:", error);
  }
}
