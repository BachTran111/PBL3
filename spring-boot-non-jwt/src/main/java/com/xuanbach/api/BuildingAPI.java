package com.xuanbach.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.model.RoomDTO;
import com.xuanbach.service.HomestayService;
import com.xuanbach.service.RoomService;

@RestController
@RequestMapping("/api/building")
public class BuildingAPI {

    @Autowired
    private HomestayService homestayService;

    @Autowired
    private RoomService roomService;

    @GetMapping("/")
    public List<HomestayDTO> getHomestay(@RequestParam Map<String, String> params) {
        return homestayService.findByName(params);
    }

    @GetMapping("/rooms")
    public List<RoomDTO> getRooms(@RequestParam Map<String, String> params) {
        return roomService.findRooms(params);
    }

    @PostMapping("/")
    public ResponseEntity<String> addBuilding(@RequestBody HomestayDTO homestayDTO) {
        boolean success = homestayService.addHomestay(homestayDTO);
        if (success) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Homestay đã được thêm thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thêm homestay thất bại!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBuilding(@PathVariable Long id) {
        boolean deleted = homestayService.deleteHomestay(id);
        if (deleted) {
            return ResponseEntity.ok("Đã xóa homestay có ID: " + id);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy homestay để xóa!");
        }
    }
}

	

