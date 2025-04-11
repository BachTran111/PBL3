package com.xuanbach.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.sql.Date;

public class HomestayDTO {
    private Long homestayID;
    private String name;
    private String location;
    private String description;
    private Double surfRating;
    private String approveStatus;
    private Long approvedBy;
    private String contactInfo;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date createdAt;
    private String status;

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    private String street;
    private String ward;
    private String district;

    // Constructor mặc định
    public HomestayDTO() {
    }

    // Getters and Setters
    public Long getHomestayID() {
        return homestayID;
    }

    public void setHomestayID(Long homestayID) {
        this.homestayID = homestayID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getSurfRating() {
        return surfRating;
    }

    public void setSurfRating(Double surfRating) {
        this.surfRating = surfRating;
    }

    public String getApproveStatus() {
        return approveStatus;
    }

    public void setApproveStatus(String approveStatus) {
        this.approveStatus = approveStatus;
    }

    public Long getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(Long approvedBy) {
        this.approvedBy = approvedBy;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public java.sql.Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
