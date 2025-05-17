export async function fetchHomestayImages(homestayId) {
  try {
    // Gửi yêu cầu fetch ảnh của homestay từ API
    const response = await fetch(
      `http://localhost:8080/homestay/api/homestays/${homestayId}/images`
    );
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.log("Không có ảnh cho homestay này.");
      return;
    }

    // Lấy phần tử chứa ảnh sẽ được render
    const galleryLarge = document.querySelector(".gallery-large img");
    const gallerySmall = document.querySelector(".gallery-small");

    // Lấy ảnh đầu tiên làm ảnh lớn
    const primaryImageUrl = data[0].imageUrl;
    galleryLarge.src = primaryImageUrl; // Ảnh lớn của homestay

    // Xóa ảnh nhỏ cũ
    gallerySmall.innerHTML = "";

    // Render các ảnh còn lại vào gallery-small
    data.slice(1).forEach((image) => {
      const smallImage = document.createElement("img");
      smallImage.src = image.imageUrl; // Giả sử mỗi ảnh có thuộc tính 'imageUrl'
      smallImage.alt = `Ảnh homestay ${image.imageId}`;
      gallerySmall.appendChild(smallImage);
    });
  } catch (error) {
    console.error("Lỗi khi lấy ảnh homestay:", error);
  }
}
