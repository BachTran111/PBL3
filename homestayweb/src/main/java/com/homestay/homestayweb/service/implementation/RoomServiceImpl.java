package com.homestay.homestayweb.service.implementation;

import com.homestay.homestayweb.dto.request.RoomRequest;
import com.homestay.homestayweb.dto.response.RoomResponse;
import com.homestay.homestayweb.entity.Homestay;
import com.homestay.homestayweb.entity.Room;
import com.homestay.homestayweb.exception.ResourceNotFoundException;
import com.homestay.homestayweb.exception.ForbiddenException;
import com.homestay.homestayweb.repository.HomestayRepository;
import com.homestay.homestayweb.repository.RoomRepository;
import com.homestay.homestayweb.security.UserDetailsImpl;
import com.homestay.homestayweb.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final HomestayRepository homestayRepository;

    @Override
    public RoomResponse createRoom(Long homestayId, RoomRequest request) {
        Homestay homestay = homestayRepository.findById(homestayId)
                .orElseThrow(() -> new RuntimeException("Homestay not found"));

        checkHomestayOwnership(homestay);

        Room room = Room.builder()
                .homestay(homestay)
                .roomType(request.getRoomType())
                .price(request.getPrice())
                .availability(true)
                .features(request.getFeatures())
                .roomStatus("ACCEPTED")
                .build();

        roomRepository.save(room);
        return mapToResponse(room);
    }

    @Override
    public List<RoomResponse> getRoomsByHomestayA(Long homestayId, String status) {
        return roomRepository.findByHomestay_HomestayIdAndRoomStatus(homestayId,status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getRoomsByHomestayP(Long homestayId, String status) {
        return roomRepository.findByHomestay_HomestayIdAndRoomStatus(homestayId,status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse pendingRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        room.setRoomStatus("ACCEPTED");
        roomRepository.save(room);
        return mapToResponse(room);
    }

    @Override
    public List<RoomResponse> getAllPendingRooms() {
            return roomRepository.findByRoomStatus("PENDING")
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }


    @Override
    public List<RoomResponse> getRoomsByHomestay(Long homestayId) {
        return roomRepository.findByHomestay_HomestayId(homestayId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return mapToResponse(room);
    }

    @Override
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findByRoomStatus("ACCEPTED")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponse updateRoom(Long roomId, RoomRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        checkRoomOwnership(room);

        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setAvailability(request.getAvailability());

        roomRepository.save(room);
        return mapToResponse(room);
    }

    @Override
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        checkRoomOwnership(room);

        roomRepository.delete(room);
    }

    private RoomResponse mapToResponse(Room room) {
        return RoomResponse.builder()
                .roomId(room.getRoomId())
                .homestayName(room.getHomestay().getName())
                .rating(room.getHomestay().getSurfRating())
                .roomType(room.getRoomType())
                .price(room.getPrice())
                .availability(room.getAvailability())
                .features(room.getFeatures())
                .district(room.getHomestay().getDistrict())
                .ward(room.getHomestay().getWard())
                .street(room.getHomestay().getStreet())
                .build();
    }

    private void checkRoomOwnership(Room room) {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Long currentUserId = currentUser.getId();
        Long roomOwnerId = room.getHomestay().getHost().getId();

        if (!currentUserId.equals(roomOwnerId)) {
            throw new ForbiddenException("Bạn không có quyền thực hiện hành động này");
        }
    }

    private void checkHomestayOwnership(Homestay homestay) {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Long currentUserId = currentUser.getId();
        Long homestayOwnerId = homestay.getHost().getId();

        if (!currentUserId.equals(homestayOwnerId)) {
            throw new ForbiddenException("Bạn không có quyền thực hiện hành động này");
        }
    }

    public List<RoomResponse> getAvailableRooms(Long homestayId, LocalDate checkIn, LocalDate checkOut) {
        List<Room> rooms = roomRepository.findAvailableRooms(homestayId, checkIn, checkOut);
        return rooms.stream().map(this::mapToResponse).toList();
    }

    @Override
    public Room getRoomEntityById(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
    }
}