package com.xuanbach.repository.entity;

import java.sql.Date;

public class HomestayEntity {
	private Long HomestayID;
	private String Name;
	private String Location;
	private String Description;
	private Double SurfRating;
	private String ApproveStatus;
	private Long ApprovedBy;
	private String ContactInfo;
	private Date CreatedAt;
	public Long getHomestayID() {
		return HomestayID;
	}
	public void setHomestayID(Long homestayID) {
		HomestayID = homestayID;
	}
	public String getName() {
		return Name;
	}
	public void setName(String name) {
		Name = name;
	}
	public String getLocation() {
		return Location;
	}
	public void setLocation(String location) {
		Location = location;
	}
	public String getDescription() {
		return Description;
	}
	public void setDescription(String description) {
		Description = description;
	}
	public Double getSurfRating() {
		return SurfRating;
	}
	public void setSurfRating(Double surfRating) {
		SurfRating = surfRating;
	}
	public String getApproveStatus() {
		return ApproveStatus;
	}
	public void setApproveStatus(String approveStatus) {
		ApproveStatus = approveStatus;
	}
	public Long getApprovedBy() {
		return ApprovedBy;
	}
	public void setApprovedBy(Long approvedBy) {
		ApprovedBy = approvedBy;
	}
	public String getContactInfo() {
		return ContactInfo;
	}
	public void setContactInfo(String contactInfo) {
		ContactInfo = contactInfo;
	}
	public Date getCreatedAt() {
		return CreatedAt;
	}
	public void setCreatedAt(Date createdAt) {
		CreatedAt = createdAt;
	}
	
}
