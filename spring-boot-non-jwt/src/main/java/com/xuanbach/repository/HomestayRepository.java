package com.xuanbach.repository;

import java.util.List;
import java.util.Map;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.repository.entity.HomestayEntity;

public interface HomestayRepository {
	List<HomestayEntity> findByName(Map<String, String> params);

	boolean addHomestay(HomestayDTO homestayDTO);

	boolean deleteHomestay(Long id);

	boolean updateHomestay(HomestayDTO homestayDTO, Long id);
}
