package com.xuanbach.repository;

import java.util.List;

import com.xuanbach.repository.entity.HomestayEntity;

public interface HomestayRepository {
	List<HomestayEntity> findByName(String name);
}
