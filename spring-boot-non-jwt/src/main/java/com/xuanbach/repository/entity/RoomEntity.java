package com.xuanbach.repository.entity;

public class RoomEntity {
    private Long roomID;
    private Long homestayID;
    private String homestayName;
    private String roomType;
    private Double price;
    private Boolean availability;
    private String features;

    public RoomEntity() {
    }

    public RoomEntity(Long roomID, Long homestayID, String roomType, Double price, Boolean availability, String features) {
        this.roomID = roomID;
        this.homestayID = homestayID;
        this.roomType = roomType;
        this.price = price;
        this.availability = availability;
        this.features = features;
    }

    public Long getRoomID() {
        return roomID;
    }

    public void setRoomID(Long roomID) {
        this.roomID = roomID;
    }

    public Long getHomestayID() {
        return homestayID;
    }

    public void setHomestayID(Long homestayID) {
        this.homestayID = homestayID;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Boolean getAvailability() {
        return availability;
    }

    public void setAvailability(Boolean availability) {
        this.availability = availability;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

	public String getHomestayName() {
		return homestayName;
	}

	public void setHomestayName(String homestayName) {
		this.homestayName = homestayName;
	}
}

