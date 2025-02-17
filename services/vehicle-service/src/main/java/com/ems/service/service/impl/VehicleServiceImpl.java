package com.ems.service.service.impl;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.commonlib.entity.vehicle.Vehicle;
import com.ems.commonlib.vo.NotificationVo;
import com.ems.service.integration.notification.NotificationServiceClient;
import com.ems.service.repository.VehicleRepository;
import com.ems.service.service.VehicleService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    private final NotificationServiceClient notificationServiceClient;

    private final TemplateEngine templateEngine;

    public VehicleServiceImpl(
            VehicleRepository vehicleRepository,
            @Qualifier("com.ems.service.integration.notification.NotificationServiceClient") NotificationServiceClient notificationServiceClient, TemplateEngine templateEngine) {
        this.vehicleRepository = vehicleRepository;
        this.notificationServiceClient = notificationServiceClient;
        this.templateEngine = templateEngine;
    }

    public static String generateQRCodeBase64(String text) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 200, 200));

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ImageIO.write(qrImage, "png", outputStream);
            byte[] qrBytes = outputStream.toByteArray();
            return Base64.getEncoder().encodeToString(qrBytes);
        }
    }

    @Override
    public Optional<Vehicle> save(Vehicle vehicle, Customer customer) throws IOException, WriterException {

        vehicle.setQrCode(generateQRCodeBase64(vehicle.getRegistrationNumber()));
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", customer.getName());
        variables.put("vehicleModel", savedVehicle.getBrand().getName());
        variables.put("licensePlate", savedVehicle.getRegistrationNumber());
        variables.put("qrCodeImage", savedVehicle.getQrCode());
        System.out.println("==============================================");
        System.out.println(savedVehicle.getRegistrationNumber());
        System.out.println("==============================================");
        System.out.println(savedVehicle.getQrCode());
        
        notificationServiceClient.sendEmail(
                NotificationVo
                        .builder()
                        .notificationSource(NotificationSource.VEHICLE_REGISTRATION)
                        .toEmails(Collections.singletonList(customer.getEmail()))
                        .variables(variables)
                        .build()
        );

        return Optional.of(savedVehicle);
    }

    @Override
    public Optional<Vehicle> update(Vehicle vehicle) {

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return Optional.of(savedVehicle);
    }

    @Override
    public Page<Vehicle> findVehiclesByRegistrationNumberLikeIgnoreCaseAndCustomerId(int pageSize, int pageNumber, String searchKey, Long customerId) {

        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNumber);

        if (searchKey != null && !searchKey.trim().isEmpty()) {
            return vehicleRepository.findVehiclesByRegistrationNumberLikeIgnoreCaseAndCustomerId(pageable, searchKey, customerId);
        }

        return vehicleRepository.findAllByCustomerId(pageable, customerId);

    }

    @Override
    public Optional<Vehicle> findByRegistrationNumber(String registrationNumber) {
        return vehicleRepository.findByRegistrationNumber(registrationNumber);
    }

    @Override
    public void delete(Long id) {
        vehicleRepository.deleteById(id);
    }

    @Override
    public Page<Vehicle> findVehiclesByRegistrationNumberLikeIgnoreCase(int size, int page, String searchKey) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        if (searchKey != null && !searchKey.trim().isEmpty()) {
            return vehicleRepository.findVehiclesByRegistrationNumberOrCustomerNICLikeIgnoreCase(pageable, searchKey);
        } else {
            return vehicleRepository.findAll(pageable);
        }
    }

    @Override
    public Optional<Vehicle> findById(Long id) {
        return vehicleRepository.findById(id);
    }

    @Override
    public ByteArrayInputStream generateReport() {
        try {

            List<Vehicle> vehicles = vehicleRepository.findAll();

            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("vehicles", vehicles);

            // Add generated date
            String generatedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));
            context.setVariable("generatedDate", generatedDate);

            // Load and encode the logo image as Base64
            ClassPathResource imgFile = new ClassPathResource("static/ems-logo.png");
            byte[] imageBytes = Files.readAllBytes(imgFile.getFile().toPath());
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String dataUri = "data:image/png;base64," + base64Image;
            context.setVariable("logo", dataUri);

            // Render HTML content using Thymeleaf
            String htmlContent = templateEngine.process("report", context);

            // Create PDF using OpenHTMLToPDF
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();

            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (Exception e) {
            // Log the exception (consider using a logger)
            e.printStackTrace();
            throw new RuntimeException("Error while generating PDF", e);
        }
    }

}
