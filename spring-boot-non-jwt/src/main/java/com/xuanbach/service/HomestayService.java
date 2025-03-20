package com.xuanbach.service;

import java.util.List;

import com.xuanbach.model.HomestayDTO;


public interface HomestayService {
	List<HomestayDTO> findByName(String name);
}
