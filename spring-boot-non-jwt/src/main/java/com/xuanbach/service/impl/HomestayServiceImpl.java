package com.xuanbach.service.impl;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.repository.HomestayRepository;
import com.xuanbach.repository.entity.HomestayEntity;
import com.xuanbach.service.HomestayService;


@Service
public class HomestayServiceImpl implements HomestayService {
    
    @Autowired
    private HomestayRepository homestayRepository;
    
    @Override
    public List<HomestayDTO> findByName(Map<String, String> params) {
        List<HomestayEntity> homestayEntities = homestayRepository.findByName(params);
        List<HomestayDTO> result = new ArrayList<>();

        for (HomestayEntity item : homestayEntities) {
            HomestayDTO homestay = new HomestayDTO();
            homestay.setHomestayID(item.getHomestayID());
            homestay.setName(item.getName());
            homestay.setLocation(item.getLocation());
            homestay.setDescription(item.getDescription());
            homestay.setSurfRating(item.getSurfRating());
            homestay.setApproveStatus(item.getApproveStatus());
            homestay.setApprovedBy(item.getApprovedBy());
            homestay.setContactInfo(item.getContactInfo());
            homestay.setCreatedAt(item.getCreatedAt());
            homestay.setStatus(generateStatus(item));
            result.add(homestay);
        }
        return result;
    }

    private String generateStatus(HomestayEntity item) {
        if (item.getApprovedBy() == null || item.getCreatedAt() == null) {
            return "Chưa được phê duyệt";
        }
        return "Được phê duyệt bởi " + item.getApprovedBy() + 
               " vào ngày " + formatDate(item.getCreatedAt());
    }

    private String formatDate(Date date) {
        if (date == null) {
            return "N/A";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        return sdf.format(date);
    }
    
    @Override
    public boolean addHomestay(HomestayDTO homestayDTO) {
        return homestayRepository.addHomestay(homestayDTO);
    }

    @Override
    public boolean deleteHomestay(Long id) {
        return homestayRepository.deleteHomestay(id);
    }

    @Override
    public boolean updateHomestay(HomestayDTO homestayDTO) {
        return homestayRepository.updateHomestay(homestayDTO,id);
    }
}
