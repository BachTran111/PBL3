package com.homestay.homestayweb.repository;

import com.homestay.homestayweb.entity.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {
    RoomImage findByRoom_RoomId(Long roomId);
}
