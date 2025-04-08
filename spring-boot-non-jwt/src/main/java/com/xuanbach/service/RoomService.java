package com.xuanbach.service;

import java.util.List;
import java.util.Map;

import com.xuanbach.model.RoomDTO;

public interface RoomService {
	List<RoomDTO> findRooms(Map<String, String> params);

    boolean addRoom(RoomDTO roomDTO);

    boolean updateRoom(RoomDTO roomDTO, Long id);

    boolean deleteRoom(Long id);
}
