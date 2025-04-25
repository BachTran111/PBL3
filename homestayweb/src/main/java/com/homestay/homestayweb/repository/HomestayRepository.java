package com.homestay.homestayweb.repository;

import com.homestay.homestayweb.entity.Homestay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomestayRepository extends JpaRepository<Homestay, Long> {
    List<Homestay> findByApproveStatus(String approveStatus);
    boolean existsByContactInfo(String contactInfo);
    List<Homestay> findByHost_Id(Long hostId);
    boolean existsByStreetAndWardAndDistrict(String street, String ward, String district);

    List<Homestay> findByDistrictAndApproveStatus(String district,String status);

}
