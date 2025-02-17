package com.ems.service.service.impl;

import com.ems.commonlib.entity.transaction.Fare;
import com.ems.service.repository.FareRepository;
import com.ems.service.service.FareService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class FareServiceImpl implements FareService {

    private final FareRepository fareRepository;

    public FareServiceImpl(FareRepository fareRepository) {
        this.fareRepository = fareRepository;
    }

    @Override
    public void processFareSheet(MultipartFile file, String category) {
        // Read the file as a CSV
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            List<String> headers = new ArrayList<>();

            boolean isFirstRow = true;

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (isFirstRow) {
                    headers = Arrays.asList(parts); // Save column headers
                    isFirstRow = false;
                    continue;
                }

                // Process each row
                String source = parts[0];
                for (int i = 1; i < parts.length; i++) {
                    String destination = headers.get(i);
                    String fareValue = parts[i];

                    if (!fareValue.isEmpty()) {
                        double fare = Double.parseDouble(fareValue);
                        updateOrInsertFare(source, destination, fare, category);
                        updateOrInsertFare(destination, source, fare, category);
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Page<Fare> getFaresWithFilters(
            String source,
            String destination,
            String category,
            Pageable pageable) {

        return fareRepository.findAll((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (source != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("source"), source));
            }

            if (destination != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("destination"), destination));
            }

            if (category != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("category"), category));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        }, pageable);
    }

    @Override
    public Optional<Fare> findBySourceAndDestinationAndCategory(String source, String destination, String category) {
        return fareRepository.findBySourceAndDestinationAndCategory(source, destination, category);
    }

    private void updateOrInsertFare(String sourceName, String destinationName, double fare, String category) {

        // Check if fare already exists
        Optional<Fare> existingFare = fareRepository.findBySourceAndDestinationAndCategory(sourceName, destinationName, category);

        if (existingFare.isPresent()) {
            // Update fare
            Fare fareToUpdate = existingFare.get();
            fareToUpdate.setFare(fare);
            fareRepository.save(fareToUpdate);
        } else {
            // Insert new fare
            Fare newFare = Fare
                    .builder()
                    .category(category)
                    .destination(destinationName)
                    .source(sourceName)
                    .fare(fare)
                    .build();
            fareRepository.save(newFare);
        }
    }
}
