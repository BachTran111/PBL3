//package com.homestay.homestayweb.controller;
//
//import com.homestay.homestayweb.service.HomestayImageService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("api/homestays/{homestayId}/images")
//@RequiredArgsConstructor
//public class HomestayImageController {
//    private final HomestayImageService homestayImageService;
//
//    @PostMapping
//    public ResponseEntity<String> uploadImages(@PathVariable Long homestayId,
//                                               @RequestParam("images") List<MultipartFile> images) {
//        homestayImageService.uploadImages(homestayId, images);
//        return ResponseEntity.ok("Images uploaded successfully");
//    }
//}
