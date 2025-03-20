package com.xuanbach.repository.impl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

import com.xuanbach.repository.HomestayRepository;
import com.xuanbach.repository.entity.HomestayEntity;

@Repository
public class HomestayRepositoryImpl implements HomestayRepository {
	static final String DB_URL = "jdbc:mysql://localhost:3306/homestay_management2.0";
	static final String USER = "root";
	static final String PASS = "Bachdepzai11";
	@GetMapping(value="/api/building/")
	public List<HomestayEntity> findByName(String name) {
		String sql = "select * from homestay where name like '%" + name + "%'";
		List<HomestayEntity> result = new ArrayList<>();
		try(Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);){
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			//System.out.println("Connect successfully...");

			while(rs.next()){
			HomestayEntity hm = new HomestayEntity();
			hm.setName(rs.getString("Name"));
			hm.setHomestayID(rs.getLong("HomestayID"));
			hm.setDescription(rs.getString("Description"));
			result.add(hm);
		}

			} catch(SQLException e){
			e.printStackTrace();
			System.out.println("Connect failed...");
		}
		return result;
	}

}
