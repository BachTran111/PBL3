package com.xuanbach.repository.impl;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.xuanbach.model.HomestayDTO;
import com.xuanbach.repository.HomestayRepository;
import com.xuanbach.repository.entity.HomestayEntity;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
@Transactional
public class HomestayRepositoryImpl implements HomestayRepository {
    static final String DB_URL = "jdbc:mysql://localhost:3306/homestay";
    static final String USER = "root";
    static final String PASS = "Bachdepzai11";

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping(value = "/homestay/")
    public List<HomestayEntity> findByName(Map<String, String> params) {
        StringBuilder sql = new StringBuilder("SELECT * FROM homestay WHERE 1=1 ");

        if (params.containsKey("name")) {
            sql.append(" AND name LIKE '%").append(params.get("name")).append("%' ");
        }

        if (params.containsKey("location")) {
            sql.append(" AND (street LIKE '%").append(params.get("location")).append("%' ")
                    .append("OR ward LIKE '%").append(params.get("location")).append("%' ")
                    .append("OR district LIKE '%").append(params.get("location")).append("%') ");
        }

        if (params.containsKey("minSurfRating")) {
            double minRating = Math.max(0, Double.parseDouble(params.get("minSurfRating")));
            sql.append(" AND surf_rating >= ").append(minRating).append(" ");
        }

        if (params.containsKey("maxSurfRating")) {
            double maxRating = Math.min(5, Double.parseDouble(params.get("maxSurfRating")));
            sql.append(" AND surf_rating <= ").append(maxRating).append(" ");
        }
        Query query = entityManager.createNativeQuery(sql.toString(), HomestayEntity.class);
        List<HomestayEntity> result = query.getResultList();
        return result;
    }

    @Override
    public boolean addHomestay(HomestayDTO homestayDTO) {
        String sql = "INSERT INTO homestay (name, street, ward, district, description, surf_rating, " +
                "approve_status, approved_by, contact_info, created_at) " +
                "VALUES (:name, :street, :ward, :district, :description, :surfRating, " +
                ":approveStatus, :approvedBy, :contactInfo, :createdAt)";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("name", homestayDTO.getName());
        query.setParameter("street", homestayDTO.getStreet());
        query.setParameter("ward", homestayDTO.getWard());
        query.setParameter("district", homestayDTO.getDistrict());
        query.setParameter("description", homestayDTO.getDescription());
        query.setParameter("surfRating", homestayDTO.getSurfRating());
        query.setParameter("approveStatus", homestayDTO.getApproveStatus());
        query.setParameter("approvedBy", homestayDTO.getApprovedBy());
        query.setParameter("contactInfo", homestayDTO.getContactInfo());
        query.setParameter("createdAt", homestayDTO.getCreatedAt());
        return query.executeUpdate() > 0;
    }

    @Override
    public boolean deleteHomestay(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append("DELETE FROM homestay WHERE homestay_id = ").append(id);

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
             Statement stmt = conn.createStatement()) {

            return stmt.executeUpdate(sql.toString()) > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public boolean updateHomestay(HomestayDTO homestayDTO, Long id) {
        StringBuilder sql = new StringBuilder("UPDATE homestay SET ");
        Map<String, Object> params = new HashMap<>();

        boolean isFirst = true;

        if (homestayDTO.getName() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("name = :name");
            params.put("name", homestayDTO.getName());
            isFirst = false;
        }

        if (homestayDTO.getStreet() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("street = :street");
            params.put("street", homestayDTO.getStreet());
            isFirst = false;
        }

        if (homestayDTO.getWard() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("ward = :ward");
            params.put("ward", homestayDTO.getWard());
            isFirst = false;
        }

        if (homestayDTO.getDistrict() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("district = :district");
            params.put("district", homestayDTO.getDistrict());
            isFirst = false;
        }

        if (homestayDTO.getDescription() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("description = :description");
            params.put("description", homestayDTO.getDescription());
            isFirst = false;
        }

        if (homestayDTO.getSurfRating() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("surf_rating = :surfRating");
            params.put("surfRating", homestayDTO.getSurfRating());
            isFirst = false;
        }

        if (homestayDTO.getApproveStatus() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("approve_status = :approveStatus");
            params.put("approveStatus", homestayDTO.getApproveStatus());
            isFirst = false;
        }

        if (homestayDTO.getApprovedBy() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("approved_by = :approvedBy");
            params.put("approvedBy", homestayDTO.getApprovedBy());
            isFirst = false;
        }

        if (homestayDTO.getContactInfo() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("contact_info = :contactInfo");
            params.put("contactInfo", homestayDTO.getContactInfo());
            isFirst = false;
        }

        if (homestayDTO.getCreatedAt() != null) {
            if (!isFirst) sql.append(", ");
            sql.append("created_at = :createdAt");
            params.put("createdAt", homestayDTO.getCreatedAt());
            isFirst = false;
        }

        sql.append(" WHERE homestay_id = :id");
        params.put("id", id);

        Query query = entityManager.createNativeQuery(sql.toString());
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        return query.executeUpdate() > 0;
    }


}

