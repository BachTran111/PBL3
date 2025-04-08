package com.xuanbach.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.xuanbach.model.RoomDTO;
import com.xuanbach.repository.RoomRepository;
import com.xuanbach.repository.entity.RoomEntity;
import com.xuanbach.service.RoomService;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public List<RoomDTO> findRooms(Map<String, String> params) {
        List<RoomEntity> roomEntities = roomRepository.findRooms(params);
        List<RoomDTO> result = new ArrayList<>();

        for (RoomEntity item : roomEntities) {
            RoomDTO room = new RoomDTO();
            room.setRoomID(item.getRoomID());
            room.setHomestayID(item.getHomestayID());
            room.setHomestayName(item.getHomestayName());
            room.setRoomType(item.getRoomType());
            room.setPrice(item.getPrice());
            room.setAvailability(item.getAvailability());
            room.setFeatures(item.getFeatures());

            result.add(room);
        }
        return result;
    }

    @Override
    public boolean addRoom(RoomDTO roomDTO) {
        return roomRepository.addRoom(roomDTO);
    }

    @Override
    public boolean updateRoom(RoomDTO roomDTO, Long id) {
        return roomRepository.updateRoom(roomDTO,id);
    }

    @Override
    public boolean deleteRoom(Long id) {
        return roomRepository.deleteRoom(id);
    }
}
