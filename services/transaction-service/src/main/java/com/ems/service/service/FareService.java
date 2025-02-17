package com.ems.service.service;

import com.ems.commonlib.entity.transaction.Fare;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface FareService {

    void processFareSheet(MultipartFile file, String category);

    Page<Fare> getFaresWithFilters(
            String source,
            String destination,
            String category,
            Pageable pageable);

    Optional<Fare> findBySourceAndDestinationAndCategory(String source, String destination, String category);
}
