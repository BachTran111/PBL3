package com.homestay.homestayweb.repository;

import com.homestay.homestayweb.dto.response.RoomResponse;
import com.homestay.homestayweb.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Arrays;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHomestay_HomestayId(Long homestayId);

    List<Room> findByRoomStatus(String status);
    List<Room> findByHomestay_HomestayIdAndRoomStatus(Long homestayId, String status);
}
