package com.xuanbach.api;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.xuanbach.beans.BuildingDTO;

@RestController
public class BuildingAPI {
//	@GetMapping("/test")
//	public String testAPI() {
//		return "success";
//	}
	static final String DB_URL = "jdbc:mysql://localhost:3306/homestay_management2.0";
	static final String USER = "root";
	static final String PASS = "Bachdepzai11";
	@GetMapping(value="/api/building/")
//	public BuildingDTO getBuilding(@RequestParam(value="name") String ten,
//							@RequestParam(value="type", required = false) Integer loai) {
//		BuildingDTO result = new BuildingDTO();
//		result.setName(ten);
//		result.setType(loai);
//		return result;
//	}
	public List<BuildingDTO> getBuilding() {
		String sql = "select * from homestay";
		List<BuildingDTO> result = new ArrayList<>();
		try(Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);){
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			//System.out.println("Connect successfully...");

			while(rs.next()){
			BuildingDTO dto = new BuildingDTO();
			dto.setName(rs.getString("name"));
			dto.setHomestayID(rs.getInt("HomestayID"));
			result.add(dto);
		}

			} catch(SQLException e){
			e.printStackTrace();
			System.out.println("Connect failed...");
		}
		return result;
			
}
	@PostMapping(value="/api/building/")
	public void addBuilding(@RequestBody BuildingDTO buildingDTO) {
		System.out.println("ok " + buildingDTO.getName() + " " + buildingDTO.getType());
	}
	
	@DeleteMapping(value="api/building/{id}")
	public void deleteBuilding(@PathVariable Integer id) {
		System.out.println("Da xoa toa nha co id la " +id +" roi.");
	}
}

	

