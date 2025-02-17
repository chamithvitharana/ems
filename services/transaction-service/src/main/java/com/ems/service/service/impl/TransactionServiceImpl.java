package com.ems.service.service.impl;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.constant.TransactionStatus;
import com.ems.commonlib.entity.accespoint.AccessPoint;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.commonlib.entity.transaction.Fare;
import com.ems.commonlib.entity.transaction.Transaction;
import com.ems.commonlib.entity.vehicle.Vehicle;
import com.ems.commonlib.vo.LiveAccessPointCountVo;
import com.ems.commonlib.vo.NotificationVo;
import com.ems.commonlib.vo.TransactionVo;
import com.ems.service.integration.accesspoint.AccessPointServiceClient;
import com.ems.service.integration.customer.CustomerServiceClient;
import com.ems.service.integration.notification.NotificationServiceClient;
import com.ems.service.integration.vehicle.VehicleServiceClient;
import com.ems.service.repository.TransactionRepository;
import com.ems.service.service.FareService;
import com.ems.service.service.TransactionService;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentMethodAttachParams;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class TransactionServiceImpl implements TransactionService {
    private static final double EARTH_RADIUS_KM = 6371.0;
    private final VehicleServiceClient vehicleServiceClient;
    private final AccessPointServiceClient accessPointServiceClient;
    private final CustomerServiceClient customerServiceClient;
    private final TransactionRepository transactionRepository;
    private final NotificationServiceClient notificationServiceClient;
    private final FareService fareService;
    private final TemplateEngine templateEngine;

    @Value("${stripe.api.secretKey}")
    private String stripeApiKey;


    public TransactionServiceImpl(
            @Qualifier("com.ems.service.integration.vehicle.VehicleServiceClient") VehicleServiceClient vehicleServiceClient,
            @Qualifier("com.ems.service.integration.accesspoint.AccessPointServiceClient") AccessPointServiceClient accessPointServiceClient,
            @Qualifier("com.ems.service.integration.customer.CustomerServiceClient") CustomerServiceClient customerServiceClient,
            TransactionRepository transactionRepository,
            @Qualifier("com.ems.service.integration.notification.NotificationServiceClient") NotificationServiceClient notificationServiceClient,
            FareService fareService, TemplateEngine templateEngine) {
        this.vehicleServiceClient = vehicleServiceClient;
        this.accessPointServiceClient = accessPointServiceClient;
        this.customerServiceClient = customerServiceClient;
        this.transactionRepository = transactionRepository;
        this.notificationServiceClient = notificationServiceClient;
        this.fareService = fareService;
        this.templateEngine = templateEngine;
    }

    @Override
    public Transaction transactionManage(String vehicleNumber, Long accessPointId) {
        Vehicle vehicle = vehicleServiceClient.getByVehicleNumber(vehicleNumber).getBody().getData().get();
        Customer customer = customerServiceClient.getById(String.valueOf(vehicle.getCustomerId())).getBody().getData().get();

        Optional<Transaction> transaction = findByVehicleIdAndStatus(vehicle.getId(), TransactionStatus.ENTERED);

        AccessPoint accessPoint = accessPointServiceClient.getById(accessPointId).getBody().getData().get();

        if (transaction.isPresent()) {

            AccessPoint entrance = accessPointServiceClient.getById(transaction.get().getEntranceId()).getBody().getData().get();

            Double charge = calculateToll(vehicle, accessPoint, entrance);
            Transaction t = transaction.get();
            t.setAmount(charge);
            t.setEntranceName(entrance.getName());
            t.setExitName(accessPoint.getName());
            t.setExitId(accessPoint.getId());

            try {
                if (customer.getPaymentId() != null) {
                    handleStripePayment(customer.getPaymentId(), customer, charge);
                    t.setStatus(TransactionStatus.COMPLETED);
                    sendNotifications(vehicle, customer, transaction, entrance, accessPoint, charge);
                } else {
                    t.setStatus(TransactionStatus.PENDING_PAYMENT);
                }
            } catch (Exception e) {
                t.setStatus(TransactionStatus.PAYMENT_FAILED);
            }
            transactionRepository.save(t);

            return t;
        } else {
            Transaction trans = Transaction.builder()
                    .status(TransactionStatus.ENTERED)
                    .code(UUID.randomUUID().toString())
                    .entranceId(accessPointId)
                    .entranceTime(LocalDateTime.now())
                    .vehicleId(vehicle.getId())
                    .vehicleRegistrationNumber(vehicleNumber)
                    .customerId(vehicle.getCustomerId())
                    .entranceName(accessPoint.getName())
                    .build();

            return transactionRepository.save(trans);
        }
    }

    private void sendNotifications(Vehicle vehicle, Customer customer, Optional<Transaction> transaction, AccessPoint entrance, AccessPoint exit, Double charge) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", customer.getName());
        variables.put("vehicleNumber", vehicle.getRegistrationNumber());
        variables.put("vehicleType", vehicle.getVehicleType().getName());
        variables.put("entranceTime", transaction.get().getEntranceTime());
        variables.put("exitTime", LocalDateTime.now());
        variables.put("charges", charge);
        variables.put("entranceName", entrance.getName());
        variables.put("exitName", exit.getName());
        variables.put("transactionDate", LocalDateTime.now().toLocalDate());

        NotificationVo notificationVo = NotificationVo.builder()
                .toEmails(Collections.singletonList(customer.getEmail()))
                .mobileNumbers(Collections.singletonList(customer.getContactNumber()))
                .variables(variables)
                .notificationSource(NotificationSource.TRANSACTION_COMPLETED)
                .build();

        notificationServiceClient.sendNotifications(notificationVo);
    }

    @Override
    public Optional<Transaction> findByVehicleIdAndStatus(Long id, TransactionStatus status) {
        return transactionRepository.findByVehicleIdAndStatus(id, status);
    }

    @Override
    public Page<Transaction> findPageBySearchKey(Integer page, Integer size, String searchKey, String customerEmail) {
        // Create Pageable with sorting by "id" in descending order
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        if (customerEmail != null) {
            return findPageByCustomerAndSearchKey(page, size, searchKey, customerEmail);
        }

        if (searchKey != null) {
            return transactionRepository.findAllBySearchKey(pageable, searchKey);
        } else {
            return transactionRepository.findAll(pageable);
        }
    }

    @Override
    public Transaction manualComplete(String id) {
        Optional<Transaction> transactionOptional = transactionRepository.findById(Long.parseLong(id));
        if (transactionOptional.isPresent()) {
            Transaction transaction = transactionOptional.get();

            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setExitTime(LocalDateTime.now());

            Vehicle vehicle = vehicleServiceClient.getById(String.valueOf(transaction.getVehicleId())).getBody().getData().get();
            Customer customer = customerServiceClient.getById(String.valueOf(vehicle.getCustomerId())).getBody().getData().get();

            AccessPoint entrance = accessPointServiceClient.getById(transaction.getEntranceId()).getBody().getData().get();;
            AccessPoint exit = accessPointServiceClient.getById(transaction.getExitId()).getBody().getData().get();;

            sendNotifications(vehicle, customer, Optional.of(transaction), entrance, exit, transaction.getAmount());

            return transactionRepository.save(transaction);
        } else {
            throw new NoSuchElementException("Transaction not found.");
        }
    }

    @Override
    public void breakdown(String vehicleNumber, String description, Double lon, Double lat) {
        Vehicle vehicle = vehicleServiceClient.getByVehicleNumber(vehicleNumber).getBody().getData().get();
        Customer customer = customerServiceClient.getById(String.valueOf(vehicle.getCustomerId())).getBody().getData().get();

        Optional<Transaction> transaction = findByVehicleIdAndStatus(vehicle.getId(), TransactionStatus.ENTERED);

        if (transaction.isPresent()) {

            AccessPoint accessPoint = accessPointServiceClient.getByNearest(lat, lon).getBody().getData().get();

            Map<String, Object> variables = new HashMap<>();
            variables.put("customerName", customer.getName());
            variables.put("contactNumber", customer.getContactNumber());
            variables.put("vehicleNumber", vehicle.getRegistrationNumber());
            variables.put("vehicleType", vehicle.getVehicleType().getName());
            variables.put("location", accessPoint.getName());
            variables.put("latitude", lat);
            variables.put("longitude", lon);
            variables.put("dateTime", LocalDateTime.now());
            variables.put("description", description);
            variables.put("emergencyTeamName", accessPoint.getName());
            variables.put("emergencyEmail", accessPoint.getEmergencyAlertEmail());
            variables.put("emergencyMobile", accessPoint.getEmergencyAlertMobile());

            NotificationVo notificationVo = NotificationVo.builder()
                    .toEmails(Collections.singletonList(accessPoint.getEmergencyAlertEmail()))
                    .mobileNumbers(Collections.singletonList(accessPoint.getEmergencyAlertMobile()))
                    .variables(variables)
                    .notificationSource(NotificationSource.BREAKDOWN_REPORTED_AGENT)
                    .build();

            notificationServiceClient.sendNotifications(notificationVo);

            // Set variables for the email template
            variables.put("teamName", accessPoint.getEmergencyAlertEmail());
            variables.put("teamContact", accessPoint.getEmergencyAlertMobile());
            variables.put("arrivalTime", "15 minutes");

            // Build the notification object
            NotificationVo notificationVoCustomer = NotificationVo.builder()
                    .toEmails(Collections.singletonList(customer.getEmail()))
                    .mobileNumbers(Collections.singletonList(customer.getContactNumber()))
                    .variables(variables)
                    .notificationSource(NotificationSource.BREAKDOWN_REPORTED_CUSTOMER)
                    .build();

            notificationServiceClient.sendNotifications(notificationVoCustomer);

        } else {
            throw new NoSuchElementException("Transaction not found.");
        }
    }

    @Override
    public Integer findCountByStatus(TransactionStatus status) {
        return transactionRepository.countByStatus(status);
    }

    @Override
    public List<LiveAccessPointCountVo> getLiveCount() {

        List<AccessPoint> accessPoints = accessPointServiceClient.getAll().getBody().getData();
        List<LiveAccessPointCountVo> data = new ArrayList<>();

        accessPoints.forEach(a -> {

            Long count = transactionRepository.countByEntranceIdAndStatus(a.getId(), TransactionStatus.ENTERED);

            LiveAccessPointCountVo build = LiveAccessPointCountVo
                    .builder()
                    .count(count)
                    .name(a.getName())
                    .lon(a.getLon())
                    .lat(a.getLat())
                    .build();

            data.add(build);
        });

        return data;
    }

    @Override
    public Optional<TransactionVo> get(String vehicleNumber) {

        Vehicle vehicle = vehicleServiceClient.getByVehicleNumber(vehicleNumber).getBody().getData().get();

        Customer customer = customerServiceClient.getById(String.valueOf(vehicle.getCustomerId())).getBody().getData().get();

        Optional<Transaction> transaction = transactionRepository.findByVehicleIdAndStatus(vehicle.getId(), TransactionStatus.ENTERED);

        TransactionVo transactionVo = new TransactionVo();
        transactionVo.setCustomer(customer);
        transactionVo.setIsCardPayment(customer.getPaymentId() != null);
        transactionVo.setVehicle(vehicle);

        if(transaction.isPresent()) {
            transactionVo.setTransaction(transaction.get());
            transactionVo.setEntrance(accessPointServiceClient.getById(transaction.get().getEntranceId()).getBody().getData().get());
        }

        return Optional.of(transactionVo);

    }

    @Override
    public ByteArrayInputStream generateReport(LocalDate start, LocalDate end, String vehicleNumber) {
        try {
            // Fetch transactions based on the provided criteria
            List<Transaction> transactions;
            if (vehicleNumber != null && !vehicleNumber.isEmpty()) {
                Vehicle vehicle = vehicleServiceClient.getByVehicleNumber(vehicleNumber).getBody().getData().get();
                transactions = transactionRepository.findAllByVehicleIdAndEntranceTimeBetween(vehicle.getId(), start.atStartOfDay(), end.atTime(23, 59, 59));
            } else {
                transactions = transactionRepository.findAllByEntranceTimeBetween(start.atStartOfDay(), end.atTime(23, 59, 59));
            }

            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("transactions", transactions);

            // Add generated date and date range
            String generatedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));
            context.setVariable("generatedDate", generatedDate);
            context.setVariable("startDate", start.format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));
            context.setVariable("endDate", end.format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));

            // Load and encode the logo image as Base64
            ClassPathResource imgFile = new ClassPathResource("static/ems-logo.png");
            byte[] imageBytes = Files.readAllBytes(imgFile.getFile().toPath());
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String dataUri = "data:image/png;base64," + base64Image;
            context.setVariable("logo", dataUri);

            // Render HTML content using Thymeleaf
            String htmlContent = templateEngine.process("report.html", context);

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



    private void handleStripePayment(String paymentMethodId, Customer customerDb, Double amount) throws StripeException {
        long amountInCents = Math.round(amount * 100); // Stripe expects amount in cents
        com.stripe.Stripe.apiKey = stripeApiKey;

        com.stripe.model.Customer customer = com.stripe.model.Customer.retrieve(customerDb.getCustomerId());

        PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
        paymentMethod.attach(PaymentMethodAttachParams.builder()
                .setCustomer(customerDb.getCustomerId())
                .build());

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("LKR")
                .setCustomer(customerDb.getCustomerId())
                .setPaymentMethod(paymentMethodId)
                .addPaymentMethodType("card")
                .setConfirm(true)
                .setOffSession(true)
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        System.out.println("Payment successful: " + paymentIntent.getId());
    }

    public double calculateToll(Vehicle vehicle, AccessPoint exit, AccessPoint entrance) {

        Optional<Fare> fare = fareService.findBySourceAndDestinationAndCategory(entrance.getName(), exit.getName(), vehicle.getVehicleType().getName());

        return fare.map(Fare::getFare).orElse(-1.0);

    }


    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }


    public Page<Transaction> findPageByCustomerAndSearchKey(Integer page, Integer size, String searchKey, String customerEmail) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);

        Customer customer = customerServiceClient.getByEmail(customerEmail).getBody().getData().get();

        if (searchKey != null) {
            return transactionRepository.findPageBySearchKeyAndCustomerId(pageable, searchKey, customer.getId());
        } else {
            return transactionRepository.findPageByCustomerId(pageable, customer.getId());
        }

    }
}
