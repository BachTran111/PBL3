package com.homestay.homestayweb.repository;

import com.homestay.homestayweb.entity.Homestay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HomestayRepository extends JpaRepository<Homestay, Long> {
    List<Homestay> findByApproveStatus(String approveStatus);
//    boolean ex(String contactInfo);
    List<Homestay> findByHost_Id(Long id);
    boolean existsByStreetAndWardAndDistrict(String street, String ward, String district);

    List<Homestay> findByDistrictAndApproveStatus(String district,String status);

    boolean existsByContactInfo(String contactInfo);

    List<Homestay> findByHost_IdAndApproveStatus(Long id, String status);
    List<Homestay> findByHost_IdAndApproveStatusNot(Long hostId, String status);

    @Query(value = """
    SELECT DISTINCT h.* FROM homestay h
    WHERE h.approve_status = 'ACCEPTED'
    AND h.homestay_id IN (
        SELECT r.homestay_id FROM room r
        WHERE r.room_status = 'ACCEPTED'
        AND (:roomType IS NULL OR r.room_type LIKE CONCAT('%', :roomType, '%'))
          AND (:priceFrom IS NULL OR r.price >= :priceFrom)
          AND (:priceTo IS NULL OR r.price <= :priceTo)
          AND (:features IS NULL OR r.features LIKE CONCAT('%', :features, '%'))
          AND (
              -- Nếu không có yêu cầu về ngày check-in/out hoặc phòng có sẵn
              (:checkInDate IS NULL OR :checkOutDate IS NULL)
              OR r.room_id NOT IN (
                  SELECT b.room_id FROM booking b
                  WHERE b.check_in_date < :checkOutDate
                    AND b.check_out_date > :checkInDate
                    AND b.booking_status = 'ACCEPTED' -- Nếu có trường status
              )
          )
    )
    AND (:surfRating IS NULL OR h.surf_rating >= :surfRating)
    AND (
        :location IS NULL OR (
            h.name LIKE CONCAT ('%', :location, '%')
            OR h.street LIKE CONCAT('%', :location, '%')
            OR h.ward LIKE CONCAT('%', :location, '%')
            OR h.district LIKE CONCAT('%', :location, '%')
        )
    )
""", nativeQuery = true)
    List<Homestay> searchHomestays(
            @Param("roomType") String roomType,
            @Param("priceFrom") Double priceFrom,
            @Param("priceTo")   Double priceTo,
            @Param("features") String features,
            @Param("checkInDate")  LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("surfRating") Double surfRating,
            @Param("location")   String location
    );
}