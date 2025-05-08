package com.homestay.homestayweb.service;

import org.springframework.web.multipart.MultipartFile;

public interface RoomImageService {
    String uploadAndSaveRoomImage(MultipartFile file, Long roomId);
}
