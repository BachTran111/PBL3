package com.homestay.homestayweb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.Column;

@Entity
@Table(name = "homestay")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Homestay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "homestay_id")
    private Long homestayId;

    private String name;
    private String street;
    private String ward;
    private String district;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double surfRating;
    private String approveStatus;
    private Long approvedBy;
    private String contactInfo;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    private User host;

}
