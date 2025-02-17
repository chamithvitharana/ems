package com.ems.accesspointservice.repository;

import com.ems.commonlib.entity.accespoint.AccessPoint;
import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccessPointRepository extends JpaRepository<AccessPoint, Long> {
    Optional<AccessPoint> findByCode(String code);

    @Query("SELECT c FROM AccessPoint c " +
            "WHERE LOWER(c.name) LIKE CONCAT('%', :searchKey, '%') " +
            "OR LOWER(c.code) LIKE CONCAT('%', :searchKey, '%') ")
    Page<AccessPoint> findBySearchKey(String searchKey, Pageable pageable);

    @Query(value = """
            SELECT *, 
                (6371 * acos(
                    cos(radians(:lat)) * cos(radians(lat)) * cos(radians(lon) - radians(:lon)) +
                    sin(radians(:lat)) * sin(radians(lat))
                )) AS distance
            FROM \"access_point\"
            ORDER BY distance
            LIMIT 1
            """, nativeQuery = true)
    AccessPoint findNearestAccessPoint(@Param("lat") Double lat, @Param("lon") Double lon);
}
