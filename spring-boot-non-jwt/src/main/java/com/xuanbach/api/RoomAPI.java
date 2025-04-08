package com.xuanbach.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.model.RoomDTO;
import com.xuanbach.service.HomestayService;
import com.xuanbach.service.RoomService;

@RestController
@RequestMapping("/room")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class RoomAPI {
    @Autowired
    private RoomService roomService;

    @GetMapping("/")
    public List<RoomDTO> getRooms(@RequestParam Map<String, String> params) {
        return roomService.findRooms(params);
    }

    @PostMapping("/")
    public ResponseEntity<String> addRoom(@RequestBody RoomDTO roomDTO) {
        boolean success = roomService.addRoom(roomDTO);
        if (success) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Phòng đã được thêm thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thêm phòng thất bại!");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateRoom(@RequestBody RoomDTO roomDTO, @PathVariable Long id) {
        boolean success = roomService.updateRoom(roomDTO, id);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).body("Phòng đã được cập nhật thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cập nhật phòng thất bại!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        boolean deleted = roomService.deleteRoom(id);
        if (deleted) {
            return ResponseEntity.ok("Đã xóa phòng có ID: " + id);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phòng để xóa!");
        }
    }

}
