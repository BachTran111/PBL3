package com.xuanbach.service.impl;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.xuanbach.utils.HomestayMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.repository.HomestayRepository;
import com.xuanbach.repository.entity.HomestayEntity;
import com.xuanbach.service.HomestayService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Service
public class HomestayServiceImpl implements HomestayService {
    
    @Autowired
    private HomestayRepository homestayRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<HomestayDTO> findByName(Map<String, String> params) {
        List<HomestayEntity> entities = homestayRepository.findByName(params);
        return entities.stream()
                .map(HomestayMapper::toDTO)
                .collect(Collectors.toList());
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
    public boolean updateHomestay(HomestayDTO homestayDTO, Long id) {
        return homestayRepository.updateHomestay(homestayDTO,id);
    }
}
