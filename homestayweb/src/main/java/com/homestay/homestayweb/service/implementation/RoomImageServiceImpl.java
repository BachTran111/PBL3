package com.homestay.homestayweb.service.implementation;

import com.homestay.homestayweb.repository.RoomImageRepository;
import com.homestay.homestayweb.repository.RoomRepository;
import com.homestay.homestayweb.service.CloudinaryService;
import com.homestay.homestayweb.service.RoomImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomImageServiceImpl implements RoomImageService {

    private final CloudinaryService cloudinaryService;
    private final RoomRepository roomRepository;
    private final RoomImageRepository roomImageRepository;


}
