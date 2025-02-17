package com.ems.service.service.impl;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.constant.NotificationType;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.commonlib.entity.notification.Notification;
import com.ems.commonlib.vo.NotificationVo;
import com.ems.service.integration.customer.CustomerServiceClient;
import com.ems.service.repository.NotificationRepository;
import com.ems.service.service.EmailService;
import com.ems.service.service.NotificationService;
import com.ems.service.service.SmsService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final CustomerServiceClient customerServiceClient;
    private final EmailService emailService;
    private final SmsService smsService;

    @Value("${customer.batch.size}")
    private int batchSize;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            @Qualifier("com.ems.service.integration.customer.CustomerServiceClient") CustomerServiceClient customerServiceClient,
            EmailService emailService,
            SmsService smsService) {
        this.notificationRepository = notificationRepository;
        this.customerServiceClient = customerServiceClient;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    @Override
    public void sendAndSave(Notification notification) {

        notification.setNotificationSource(NotificationSource.ADMIN_NOTIFICATION);
        notificationRepository.save(notification);

        if (notification.isCustomerNotification()) {
            sendNotificationsToAllCustomers(notification);
        }

    }

    @Override
    public Page<Notification> getPage(Integer size, Integer page) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return notificationRepository.findAll(pageable);
    }

    @Override
    public Page<Notification> getPageByNotificationSource(Integer size, Integer page, NotificationSource adminNotification, String searchKey) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        if (searchKey != null && !searchKey.trim().isEmpty()) {
            return notificationRepository.findAllByNotificationSourceAndContentIsLike(pageable, adminNotification, searchKey);
        }
        return notificationRepository.findAllByNotificationSource(pageable, adminNotification);
    }

    @Override
    public Page<Notification> getCustomerPage(Integer size, Integer page) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return notificationRepository.findAllByIsCustomerNotification(pageable, Boolean.TRUE);
    }

    @Override
    public Page<Notification> getAgentPage(Integer size, Integer page) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return notificationRepository.findAllByIsAgentNotification(pageable, Boolean.TRUE);
    }

    public void sendNotificationsToAllCustomers(Notification notification) {
        int page = 0;
        boolean hasMoreCustomers = true;

        while (hasMoreCustomers) {
            try {
                ResponseEntity<AppResponse<Page<Customer>>> response = customerServiceClient.getAll(batchSize, page);
                Page<Customer> customerPage = response.getBody().getData();

                if (customerPage != null && !customerPage.isEmpty()) {
                    for (Customer customer : customerPage.getContent()) {
                        sendNotificationToCustomer(customer, notification);
                    }

                    hasMoreCustomers = customerPage.hasNext();
                    page++;
                } else {
                    hasMoreCustomers = false;
                }
            } catch (RestClientException e) {
                System.err.println("Error fetching customers: " + e.getMessage());
                hasMoreCustomers = false;
            }
        }
    }

    private void sendNotificationToCustomer(Customer customer, Notification notification) {

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", customer.getName());
        variables.put("content", notification.getContent());

        if (customer.getEmailNotificationEnabled() &&
                (NotificationType.EMAIL == notification.getNotificationType() || NotificationType.EMAIL_AND_SMS == notification.getNotificationType())) {
            emailService.send(
                    customer.getEmail(),
                    notification.getNotificationSource().getSubject(),
                    notification.getNotificationSource().getEmailTemplateName(),
                    variables
            );
        }

        if (customer.getSmsNotificationEnabled() &&
                (NotificationType.SMS == notification.getNotificationType() || NotificationType.EMAIL_AND_SMS == notification.getNotificationType())) {

            NotificationVo notificationVo = new NotificationVo();
            notificationVo.setNotificationSource(notification.getNotificationSource());
            notificationVo.setVariables(variables);
            notificationVo.setMobileNumbers(Collections.singletonList(customer.getContactNumber()));

            smsService.sendSms(notificationVo);
        }

    }

    private void sendNotificationToAgent(Customer agent, Notification notification) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", agent.getName());
        variables.put("content", notification.getContent());

        if (agent.getEmailNotificationEnabled() &&
                (NotificationType.EMAIL == notification.getNotificationType() || NotificationType.EMAIL_AND_SMS == notification.getNotificationType())) {
            emailService.send(
                    agent.getEmail(),
                    notification.getNotificationSource().getSubject(),
                    notification.getNotificationSource().getEmailTemplateName(),
                    variables
            );
        }

        if (agent.getSmsNotificationEnabled() &&
                (NotificationType.SMS == notification.getNotificationType() || NotificationType.EMAIL_AND_SMS == notification.getNotificationType())) {

            NotificationVo notificationVo = new NotificationVo();
            notificationVo.setNotificationSource(notification.getNotificationSource());
            notificationVo.setVariables(variables);
            notificationVo.setMobileNumbers(Collections.singletonList(agent.getContactNumber()));

            smsService.sendSms(notificationVo);
        }
    }

}
