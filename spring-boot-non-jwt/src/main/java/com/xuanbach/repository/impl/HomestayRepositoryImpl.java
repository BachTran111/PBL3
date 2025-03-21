package com.xuanbach.repository.impl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.repository.HomestayRepository;
import com.xuanbach.repository.entity.HomestayEntity;

@Repository
public class HomestayRepositoryImpl implements HomestayRepository {
    static final String DB_URL = "jdbc:mysql://localhost:3306/homestay_management2.0";
    static final String USER = "root";
    static final String PASS = "Bachdepzai11";

    @GetMapping(value = "/api/building/")
    public List<HomestayEntity> findByName(@RequestParam Map<String, String> params) {
        StringBuilder sql = new StringBuilder("SELECT * FROM homestay WHERE 1=1 ");

        if (params.containsKey("name")) {
            sql.append("AND Name LIKE '%").append(params.get("name")).append("%' ");
        }
        if (params.containsKey("location")) {
            sql.append("AND Location LIKE '%").append(params.get("location")).append("%' ");
        }
        if (params.containsKey("minSurfRating")) {
            double minRating = Math.max(0, Double.parseDouble(params.get("minSurfRating")));
            sql.append("AND SurfRating >= ").append(minRating).append(" ");
        }
        if (params.containsKey("maxSurfRating")) {
            double maxRating = Math.min(5, Double.parseDouble(params.get("maxSurfRating")));
            sql.append("AND SurfRating <= ").append(maxRating).append(" ");
        }

        List<HomestayEntity> result = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql.toString())) {

            while (rs.next()) {
            	HomestayEntity hm = new HomestayEntity();
                hm.setHomestayID(rs.getLong("HomestayID"));
                hm.setName(rs.getString("Name"));
                hm.setLocation(rs.getString("Location"));
                hm.setDescription(rs.getString("Description"));
                hm.setSurfRating(rs.getDouble("SurfRating"));
                hm.setApproveStatus(rs.getString("ApproveStatus"));
                hm.setApprovedBy(rs.getLong("ApprovedBy"));
                hm.setContactInfo(rs.getString("ContactInfo"));
                hm.setCreatedAt(rs.getDate("CreatedAt"));
                result.add(hm);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Connect failed...");
        }
        return result;
    }
    
    @Override
    public boolean addHomestay(HomestayDTO homestayDTO) {
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO homestay (Name, Location, Description, SurfRating, ApproveStatus, ApprovedBy, ContactInfo, CreatedAt) VALUES ('")
           .append(homestayDTO.getName()).append("', '")
           .append(homestayDTO.getLocation()).append("', '")
           .append(homestayDTO.getDescription()).append("', ")
           .append(homestayDTO.getSurfRating()).append(", '")
           .append(homestayDTO.getApproveStatus()).append("', ")
           .append(homestayDTO.getApprovedBy()).append(", '")
           .append(homestayDTO.getContactInfo()).append("', '")
           .append(new java.sql.Date(homestayDTO.getCreatedAt().getTime())).append("')");

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
             Statement stmt = conn.createStatement()) {

            return stmt.executeUpdate(sql.toString()) > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteHomestay(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append("DELETE FROM homestay WHERE HomestayID = ").append(id);

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
             Statement stmt = conn.createStatement()) {

            return stmt.executeUpdate(sql.toString()) > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
}

