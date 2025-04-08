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
@RequestMapping("/homestay")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class HomestayAPI {

    @Autowired
    private HomestayService homestayService;

    @GetMapping("/")
    public List<HomestayDTO> getHomestay(@RequestParam Map<String, String> params) {
        return homestayService.findByName(params);
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

    @PutMapping("/{id}")
    public ResponseEntity<String> updateBuilding(@RequestBody HomestayDTO homestayDTO,@PathVariable Long id) {
        boolean success = homestayService.updateHomestay(homestayDTO, id);
        if (success) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Homestay đã được cập nhật thành công!");
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

	

