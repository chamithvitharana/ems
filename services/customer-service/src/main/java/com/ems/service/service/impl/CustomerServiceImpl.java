package com.ems.service.service.impl;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.constant.Status;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.commonlib.vo.NotificationVo;
import com.ems.service.integration.NotificationServiceClient;
import com.ems.service.repository.CustomerRepository;
import com.ems.service.service.CustomerService;
import com.ems.service.service.NotificationService;
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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    private final TemplateEngine templateEngine;

    private final NotificationServiceClient notificationServiceClient;

    private final NotificationService notificationService;

    public CustomerServiceImpl(
            CustomerRepository customerRepository,
            TemplateEngine templateEngine, @Qualifier("com.ems.service.integration.NotificationServiceClient") NotificationServiceClient notificationServiceClient, NotificationService notificationService) {
        this.customerRepository = customerRepository;
        this.templateEngine = templateEngine;
        this.notificationServiceClient = notificationServiceClient;
        this.notificationService = notificationService;
    }

    @Override
    public Customer save(Customer customer) {

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", customer.getName());

        if(customer.getStatus() == Status.ACTIVE) {
            notificationService.sendEmail(
                    NotificationVo
                            .builder()
                            .notificationSource(NotificationSource.CUSTOMER_REGISTRATION)
                            .toEmails(Collections.singletonList(customer.getEmail()))
                            .variables(variables)
                            .build()
            );
        }

        return customerRepository.save(customer);
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Optional<Customer> findByNic(String nic) {
        return customerRepository.findByNic(nic);
    }

    @Override
    public Optional<Customer> findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    @Override
    public Page<Customer> findPage(Integer size, Integer page) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return customerRepository.findAll(pageable);
    }

    @Override
    public Page<Customer> findPageBySearchKey(Integer size, Integer page, String searchKey) {

        if (searchKey != null) {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
            return customerRepository.findBySearchKey(searchKey, pageable);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return customerRepository.findAll(pageable);
    }

    @Override
    public ByteArrayInputStream generateCustomerReport() {
       return generateCustomerPdf(customerRepository.findAll());
    }

    @Override
    public ByteArrayInputStream generateCustomerPdf(List<Customer> customers) {
        try {
            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("customers", customers);

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
            String htmlContent = templateEngine.process("customer_report", context);

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
