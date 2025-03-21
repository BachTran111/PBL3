package com.xuanbach.service;

import java.util.List;
import java.util.Map;

import com.xuanbach.model.RoomDTO;

public interface RoomService {
	List<RoomDTO> findRooms(Map<String, String> params);
}
