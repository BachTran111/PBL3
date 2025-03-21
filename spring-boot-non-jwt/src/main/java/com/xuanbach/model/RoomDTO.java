package com.xuanbach.model;

public class RoomDTO {
    private Long roomID;
    private Long homestayID;
    private String homestayName;
    private String roomType;
    private Double price;
    private Boolean availability;
    private String features;

    public RoomDTO() {
    }

    public RoomDTO(Long roomID, Long homestayID, String homestayName, String roomType, Double price, Boolean availability, String features) {
        this.roomID = roomID;
        this.homestayID = homestayID;
        this.homestayName = homestayName;
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

    public String getHomestayName() {
        return homestayName;
    }

    public void setHomestayName(String homestayName) {
        this.homestayName = homestayName;
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
}
