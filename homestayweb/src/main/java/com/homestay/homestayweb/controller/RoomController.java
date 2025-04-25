package com.homestay.homestayweb.controller;

import com.homestay.homestayweb.dto.request.RoomRequest;
import com.homestay.homestayweb.dto.response.HomestayResponse;
import com.homestay.homestayweb.dto.response.RoomResponse;
import com.homestay.homestayweb.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping("/homestay/{homestayId}")
    @PreAuthorize("hasAuthority('CREATE_ROOM')")
    public ResponseEntity<RoomResponse> createRoom(@PathVariable Long homestayId,
                                                   @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(homestayId, request));
    }

    @PutMapping("/{roomId}")
    @PreAuthorize("hasAuthority('UPDATE_ROOM')")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long roomId,
                                                   @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(roomId, request));
    }

    @DeleteMapping("/{roomId}")
    @PreAuthorize("hasAuthority('DELETE_ROOM')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/valid-homestay/{homestayId}")
    public ResponseEntity<List<RoomResponse>> getRoomsByHomestay(@PathVariable Long homestayId) {
        return ResponseEntity.ok(roomService.getRoomsByHomestayA(homestayId,"ACCEPTED"));
    }

    @GetMapping("/pending-homestay/{homestayId}")
    public ResponseEntity<List<RoomResponse>> getRoomsByHomestayP(@PathVariable Long homestayId) {
        return ResponseEntity.ok(roomService.getRoomsByHomestayP(homestayId,"PENDING"));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RoomResponse>> getAllPendingRooms(){
        return ResponseEntity.ok(roomService.getAllPendingRooms());
    }

    @GetMapping("/{roomId}")
    @PreAuthorize("hasAuthority('VIEW_ROOM')")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getRoomById(roomId));
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms(){
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @PutMapping("/admin/pending/{id}")
    @PreAuthorize("hasAuthority('ADMIN_ACCESS')")
    public ResponseEntity<RoomResponse> pending(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.pendingRoom(id));
    }


}

