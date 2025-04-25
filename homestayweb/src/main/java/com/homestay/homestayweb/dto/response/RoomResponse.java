package com.homestay.homestayweb.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private Long roomId;
    private String homestayName;
    private Double rating;
    private String roomType;
    private Double price;
    private Boolean availability;
    private String features;
    private String district;
    private String ward;
    private String street;
}
