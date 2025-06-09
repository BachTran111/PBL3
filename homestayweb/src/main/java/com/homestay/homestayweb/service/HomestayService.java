package com.homestay.homestayweb.service;

import com.homestay.homestayweb.dto.request.HomestayRequest;
import com.homestay.homestayweb.dto.response.HomestayResponse;
import com.homestay.homestayweb.entity.Homestay;
import com.homestay.homestayweb.entity.Homestay;

import java.time.LocalDate;
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
    List<HomestayResponse> getAllByDistrict(String district,String status);
    List<HomestayResponse> getHomestayByHost(Long id);
    List<HomestayResponse> getAllPendingHomestays();
    Homestay findEntityById(Long id);
    HomestayResponse rejectHomestay(Long id);
    List<HomestayResponse> getMyHomestays();
    List<HomestayResponse> searchHomestays(String roomType, Double priceFrom, Double priceTo, String features, LocalDate checkInDate, LocalDate checkOutDate, Double surfRating, String location);
}