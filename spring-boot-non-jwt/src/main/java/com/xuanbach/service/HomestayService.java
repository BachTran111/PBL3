package com.xuanbach.service;

import java.util.List;
import java.util.Map;

import com.xuanbach.model.HomestayDTO;


public interface HomestayService {
	List<HomestayDTO> findByName(Map<String, String> params);

	boolean addHomestay(HomestayDTO homestayDTO);

	boolean deleteHomestay(Long id);
}
