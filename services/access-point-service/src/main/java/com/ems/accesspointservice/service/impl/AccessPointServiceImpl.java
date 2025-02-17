package com.ems.accesspointservice.service.impl;

import com.ems.accesspointservice.repository.AccessPointRepository;
import com.ems.accesspointservice.service.AccessPointService;
import com.ems.commonlib.entity.accespoint.AccessPoint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccessPointServiceImpl implements AccessPointService {

    private final AccessPointRepository accessPointRepository;

    public AccessPointServiceImpl(AccessPointRepository accessPointRepository) {
        this.accessPointRepository = accessPointRepository;
    }

    @Override
    public Optional<AccessPoint> save(AccessPoint accessPoint) {
        return Optional.of(accessPointRepository.save(accessPoint));
    }

    @Override
    public Optional<AccessPoint> findByCode(String code) {
        return accessPointRepository.findByCode(code);
    }

    @Override
    public List<AccessPoint> findAll() {
        return accessPointRepository.findAll();
    }

    @Override
    public Optional<AccessPoint> findById(Long id) {
        return accessPointRepository.findById(id);
    }

    @Override
    public Page<AccessPoint> findPageBySearchKey(Integer size, Integer page, String searchKey) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        if (searchKey != null && !searchKey.trim().isEmpty()) {
            return accessPointRepository.findBySearchKey(searchKey.toLowerCase(), pageable);
        }

        return accessPointRepository.findAll(pageable);
    }


    @Override
    public AccessPoint getNearestAccessPoint(Double lat, Double lon) {
        return accessPointRepository.findNearestAccessPoint(lat, lon);
    }
}
