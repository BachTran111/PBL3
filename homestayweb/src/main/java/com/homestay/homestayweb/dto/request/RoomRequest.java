package com.homestay.homestayweb.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomRequest {
    private String roomType;
    private Double price;
    private Boolean availability;
    private String features;
    private String roomStatus;
}