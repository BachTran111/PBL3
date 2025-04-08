package com.xuanbach.repository.entity;

import java.util.Date;

public class ReviewEntity {
    private Long reviewID;
    private Long homestayID;
    private Long userID;
    private Integer rating;
    private String comment;

    public Long getReviewID() {
        return reviewID;
    }

    public void setReviewID(Long reviewID) {
        this.reviewID = reviewID;
    }

    public Long getHomestayID() {
        return homestayID;
    }

    public void setHomestayID(Long homestayID) {
        this.homestayID = homestayID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    private Date createdAt;
}
