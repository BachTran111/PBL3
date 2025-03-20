package com.xuanbach.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.service.HomestayService;

@RestController
public class BuildingAPI {
	@Autowired
	private HomestayService homestayService;
	
	@GetMapping(value="/api/building/")
//	public BuildingDTO getBuilding(@RequestParam(value="name") String ten,
//							@RequestParam(value="type", required = false) Integer loai) {
//		BuildingDTO result = new BuildingDTO();
//		result.setName(ten);
//		result.setType(loai);
//		return result;
//	}
	public List<HomestayDTO> getHomestay(@RequestParam(name="name") String name){
		List<HomestayDTO> result = homestayService.findByName(name); 
		return result;
	}
	
	@PostMapping(value="/api/building/")
	public void addBuilding(@RequestBody HomestayDTO buildingDTO) {
		System.out.println("ok " + buildingDTO.getName() + " " + buildingDTO.getHomestayID());
	}
	
	@DeleteMapping(value="api/building/{id}")
	public void deleteBuilding(@PathVariable Integer id) {
		System.out.println("Da xoa toa nha co id la " +id +" roi.");
	}
}

	

