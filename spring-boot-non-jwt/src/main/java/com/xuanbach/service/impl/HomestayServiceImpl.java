package com.xuanbach.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.repository.HomestayRepository;
import com.xuanbach.repository.entity.HomestayEntity;
import com.xuanbach.service.HomestayService;


@Service
public class HomestayServiceImpl implements HomestayService{
	
	@Autowired
	private HomestayRepository homestayRepository;
	
	@Override
	public List<HomestayDTO> findByName(String name) {
		List<HomestayEntity> homestayEntities = homestayRepository.findByName(name);
		List<HomestayDTO> result = new ArrayList<>();
		for(HomestayEntity item : homestayEntities) {
			HomestayDTO homestay = new HomestayDTO();
			 homestay.setName(item.getName());
			 homestay.setHomestayID(item.getHomestayID());
			 homestay.setStatus("Duoc phe duyet boi " +item.getApprovedBy()+" vao ngay " +item.getCreatedAt());
			 homestay.setDescription(item.getDescription());
			 result.add(homestay);
		}
		return result;
	}

}
