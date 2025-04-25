package com.homestay.homestayweb.service;

import com.homestay.homestayweb.dto.request.HomestayRequest;
import com.homestay.homestayweb.dto.response.HomestayResponse;
import java.util.Optional;

import java.util.List;

public interface HomestayService {
    HomestayResponse createHomestay(HomestayRequest request);
    HomestayResponse getHomestayById(Long id);
    List<HomestayResponse> getAllHomestays();
    List<HomestayResponse> getHomestaysByHostId(Long hostId);
    HomestayResponse updateHomestay(Long id, HomestayRequest request);
    void deleteHomestay(Long id);
    HomestayResponse pendingHomestay(Long id);

    List<HomestayResponse> getAllByDistrict(String district);
}