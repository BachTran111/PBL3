package com.homestay.homestayweb.service.implementation;

import com.homestay.homestayweb.dto.request.HomestayRequest;
import com.homestay.homestayweb.dto.response.HomestayResponse;
import com.homestay.homestayweb.entity.Homestay;
import com.homestay.homestayweb.entity.User;
import com.homestay.homestayweb.exception.BadRequestException;
import com.homestay.homestayweb.exception.DuplicateResourceException;
import com.homestay.homestayweb.exception.ResourceNotFoundException;
import com.homestay.homestayweb.repository.HomestayRepository;
import com.homestay.homestayweb.repository.UserRepository;
import com.homestay.homestayweb.security.UserDetailsImpl;
import com.homestay.homestayweb.service.HomestayService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomestayServiceImpl implements HomestayService {
    private final HomestayRepository homestayRepository;
    private final UserRepository userRepository;

    @Override
    public HomestayResponse createHomestay(HomestayRequest request) {
        // Kiểm tra tên
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("Tên homestay không được để trống.");
        }

        // Kiểm tra định dạng email
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (!Pattern.matches(emailRegex, request.getContactInfo())) {
            throw new BadRequestException("Email không đúng định dạng.");
        }

        // Kiểm tra email trùng
        if (homestayRepository.existsByContactInfo(request.getContactInfo())) {
            throw new DuplicateResourceException("Email đã tồn tại.");
        }

        // Kiểm tra trùng địa chỉ
        if (homestayRepository.existsByStreetAndWardAndDistrict(
                request.getStreet(), request.getWard(), request.getDistrict())) {
            throw new DuplicateResourceException("Địa chỉ homestay đã tồn tại.");
        }

        // Lấy user hiện tại
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        // Tạo homestay
        Homestay homestay = Homestay.builder()
                .name(request.getName())
                .street(request.getStreet())
                .ward(request.getWard())
                .district(request.getDistrict())
                .description(request.getDescription())
                .surfRating(request.getSurfRating())
                .approveStatus(request.getApproveStatus())
                .approvedBy(request.getApprovedBy())
                .contactInfo(request.getContactInfo())
                .host(user) // Gán host
                .build();

        homestayRepository.save(homestay);
        return mapToResponse(homestay);
    }

    @Override
    public HomestayResponse getHomestayById(Long id) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found"));
        return mapToResponse(homestay);
    }

    @Override
    public List<HomestayResponse> getAllHomestays() {
        List<Homestay> homestays = homestayRepository.findByApproveStatus("ACCEPTED");
        return homestays.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<HomestayResponse> getHomestaysByHostId(Long hostId) {
        List<Homestay> homestays = homestayRepository.findByHost_Id(hostId);
        return homestays.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HomestayResponse updateHomestay(Long id, HomestayRequest request) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found"));

        homestay.setName(request.getName());
        homestay.setStreet(request.getStreet());
        homestay.setWard(request.getWard());
        homestay.setDistrict(request.getDistrict());
        homestay.setDescription(request.getDescription());
        homestay.setSurfRating(request.getSurfRating());
        homestay.setApproveStatus(request.getApproveStatus());
        homestay.setApprovedBy(request.getApprovedBy());
        homestay.setContactInfo(request.getContactInfo());

        homestayRepository.save(homestay);
        return mapToResponse(homestay);
    }

    @Override
    public void deleteHomestay(Long id) {
        if (!homestayRepository.existsById(id)) {
            throw new ResourceNotFoundException("Homestay not found");
        }
        homestayRepository.deleteById(id);
    }

    @Override
    public HomestayResponse pendingHomestay(Long id) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found"));
        homestay.setApproveStatus("ACCEPTED");
        homestayRepository.save(homestay);
        return mapToResponse(homestay);
    }


    @Override
    public List<HomestayResponse> getHomestaysByHostId(Long id) {
        List<Homestay> homestays = homestayRepository.findByHost_Id(id);
        return homestays.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<HomestayResponse> getAllPendingHomestays() {
        List<Homestay> homestays = homestayRepository.findByApproveStatus("PENDING");
        return homestays.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<HomestayResponse> getAllByDistrict(String district,String status) {
        List<Homestay> homestays = homestayRepository.findByDistrictAndApproveStatus(district,"ACCEPTED");
        return homestays.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private HomestayResponse mapToResponse(Homestay homestay) {
        return HomestayResponse.builder()
                .id(homestay.getHomestayId())
                .name(homestay.getName())
                .street(homestay.getStreet())
                .ward(homestay.getWard())
                .district(homestay.getDistrict())
                .description(homestay.getDescription())
                .surfRating(homestay.getSurfRating())
                .approveStatus(homestay.getApproveStatus())
                .approvedBy(homestay.getApprovedBy())
                .contactInfo(homestay.getContactInfo())
                .createdAt(homestay.getCreatedAt())
                .build();
    }

    public Homestay findEntityById(Long id) {
        return homestayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Homestay not found"));
    }
}