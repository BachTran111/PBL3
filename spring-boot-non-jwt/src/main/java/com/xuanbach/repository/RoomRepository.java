package com.xuanbach.repository;

import java.util.List;
import java.util.Map;

import com.xuanbach.repository.entity.RoomEntity;

public interface RoomRepository {
	List<RoomEntity> findRooms(Map<String, String> params);
}
