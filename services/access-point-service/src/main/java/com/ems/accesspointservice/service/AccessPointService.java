package com.ems.accesspointservice.service;

import com.ems.commonlib.entity.accespoint.AccessPoint;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface AccessPointService {

    Optional<AccessPoint> save(AccessPoint accessPoint);

    Optional<AccessPoint> findByCode(String code);

    List<AccessPoint> findAll();

    Optional<AccessPoint> findById(Long id);

    Page<AccessPoint> findPageBySearchKey(Integer size, Integer page, String searchKey);

    AccessPoint getNearestAccessPoint(Double lat, Double lon);
}
