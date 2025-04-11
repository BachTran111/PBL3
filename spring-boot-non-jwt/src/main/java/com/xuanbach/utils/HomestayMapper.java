package com.xuanbach.utils;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.repository.entity.HomestayEntity;

import java.util.Optional;

public class HomestayMapper {

    public static HomestayDTO toDTO(HomestayEntity entity) {
        if (entity == null) return null;

        HomestayDTO dto = new HomestayDTO();
        dto.setHomestayID(entity.getHomestayID());
        dto.setName(entity.getName());

        String location = String.join(", ",
                Optional.ofNullable(entity.getStreet()).orElse(""),
                Optional.ofNullable(entity.getWard()).orElse(""),
                Optional.ofNullable(entity.getDistrict()).orElse("")
        ).replaceAll(",\\s*,", ",").replaceAll("^,|,$", "").trim();

        dto.setLocation(location);
        dto.setDescription(entity.getDescription());
        dto.setSurfRating(entity.getSurfRating());
        dto.setApproveStatus(entity.getApproveStatus());
        dto.setApprovedBy(entity.getApprovedBy());
        dto.setContactInfo(entity.getContactInfo());
        dto.setCreatedAt(entity.getCreatedAt());

        // Nếu có method riêng để sinh status
        dto.setStatus(generateStatus(entity));

        return dto;
    }
    private static String generateStatus(HomestayEntity entity) {
        // Tuỳ logic của bạn, ví dụ:
        if ("approved".equalsIgnoreCase(entity.getApproveStatus())) {
            return "Đã duyệt";
        } else if ("pending".equalsIgnoreCase(entity.getApproveStatus())) {
            return "Chờ duyệt";
        }
        return "Không rõ";
    }
}
