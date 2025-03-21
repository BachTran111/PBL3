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

import com.xuanbach.repository.RoomRepository;
import com.xuanbach.repository.entity.RoomEntity;

@Repository
public class RoomRepositoryImpl implements RoomRepository {
    static final String DB_URL = "jdbc:mysql://localhost:3306/homestay_management2.0";
    static final String USER = "root";
    static final String PASS = "Bachdepzai11";

    @Override
    public List<RoomEntity> findRooms(Map<String, String> params) {
        StringBuilder sql = new StringBuilder(
            "SELECT r.*, h.Name as homestayName " +
            "FROM room r " +
            "JOIN homestay h ON r.HomestayID = h.HomestayID " +
            "WHERE 1=1 "
        );

        if (params.containsKey("homestayName")) {
            sql.append("AND h.Name LIKE '%").append(params.get("homestayName")).append("%' ");
        }
        if (params.containsKey("roomType")) {
            sql.append("AND r.RoomType LIKE '%").append(params.get("roomType")).append("%' ");
        }
        if (params.containsKey("minPrice")) {
            sql.append("AND r.Price >= ").append(params.get("minPrice")).append(" ");
        }
        if (params.containsKey("maxPrice")) {
            sql.append("AND r.Price <= ").append(params.get("maxPrice")).append(" ");
        }
        if (params.containsKey("features")) {
            sql.append("AND r.Features LIKE '%").append(params.get("features")).append("%' ");
        }

        List<RoomEntity> result = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql.toString())) {

            while (rs.next()) {
                RoomEntity room = new RoomEntity();
                room.setRoomID(rs.getLong("RoomID"));
                room.setHomestayID(rs.getLong("HomestayID"));
                room.setHomestayName(rs.getString("HomestayName"));
                room.setRoomType(rs.getString("RoomType"));
                room.setPrice(rs.getDouble("Price"));
                room.setAvailability(rs.getBoolean("Availability"));
                room.setFeatures(rs.getString("Features"));

                result.add(room);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return result;
    }
}
