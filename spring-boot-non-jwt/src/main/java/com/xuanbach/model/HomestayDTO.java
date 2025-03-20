package com.xuanbach.model;

public class HomestayDTO {
	private String name;
	private Long homestayID;
	private String description;
	private String Status;
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
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
	public String getStatus() {
		return Status;
	}
	public void setStatus(String status) {
		Status = status;
	}
}
