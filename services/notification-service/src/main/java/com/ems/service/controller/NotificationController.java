package com.ems.service.controller;

import com.ems.commonlib.constant.NotificationType;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.notification.Notification;
import com.ems.commonlib.vo.NotificationVo;
import com.ems.service.service.EmailService;
import com.ems.service.service.NotificationService;
import com.ems.service.service.SmsService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/notification")
public class NotificationController {

    private final EmailService emailService;

    private final NotificationService notificationService;

    private final SmsService smsService;

    public NotificationController(EmailService emailService, NotificationService notificationService, SmsService smsService) {
        this.emailService = emailService;
        this.notificationService = notificationService;
        this.smsService = smsService;
    }

    @PostMapping
    public ResponseEntity<Boolean> sendNotification(@RequestBody NotificationVo notification) {

        NotificationType notificationType = notification.getNotificationSource().getNotificationType();
        if( notificationType == NotificationType.EMAIL) {

            emailService.send(
                    notification.getToEmails().get(0),
                    notification.getNotificationSource().getSubject(),
                    notification.getNotificationSource().getEmailTemplateName(),
                    notification.getVariables()
            );

        } else if (notificationType == NotificationType.EMAIL_AND_SMS) {

            emailService.send(
                    notification.getToEmails().get(0),
                    notification.getNotificationSource().getSubject(),
                    notification.getNotificationSource().getEmailTemplateName(),
                    notification.getVariables()
            );

            smsService.sendSms(notification);

        } else if (notificationType == NotificationType.SMS) {

            smsService.sendSms(notification);
        }


        return ResponseEntity.ok(Boolean.TRUE);
    }

    @GetMapping("/customer")
    public ResponseEntity<AppResponse<Page<Notification>>> getCustomerPage(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page
    ) {
        Page<Notification> notifications = notificationService.getCustomerPage(size, page);
        AppResponse<Page<Notification>> response = AppResponse.<Page<Notification>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Admin notifications retrieved successfully")
                .data(notifications)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/agent")
    public ResponseEntity<AppResponse<Page<Notification>>> getAgentPage(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page
    ) {
        Page<Notification> notifications = notificationService.getAgentPage(size, page);
        AppResponse<Page<Notification>> response = AppResponse.<Page<Notification>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Admin notifications retrieved successfully")
                .data(notifications)
                .build();
        return ResponseEntity.ok(response);
    }
}
