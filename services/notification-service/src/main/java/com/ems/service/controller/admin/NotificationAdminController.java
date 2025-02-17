package com.ems.service.controller.admin;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.constant.NotificationType;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.dto.notification.request.NotificationRequestDto;
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
@RequestMapping("/api/v1/notification/admin")
public class NotificationAdminController {

    private final EmailService emailService;

    private final NotificationService notificationService;

    private final SmsService smsService;

    public NotificationAdminController(EmailService emailService, NotificationService notificationService, SmsService smsService) {
        this.emailService = emailService;
        this.notificationService = notificationService;
        this.smsService = smsService;
    }

    @PostMapping
    public ResponseEntity<Boolean> sendNotifications(@RequestBody NotificationVo notification) {

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

    @PostMapping("/publish")
    public ResponseEntity<AppResponse<Boolean>> saveAndSend(@RequestBody NotificationRequestDto requestDto) {
        notificationService.sendAndSave(requestDto.getNotification());
        AppResponse<Boolean> response = AppResponse.<Boolean>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Notification saved and sent successfully")
                .data(Boolean.TRUE)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<AppResponse<Page<Notification>>> getPage(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @RequestParam(value = "searchKey", required = false) String searchKey
    ) {
        Page<Notification> notifications = notificationService.getPageByNotificationSource(size, page, NotificationSource.ADMIN_NOTIFICATION, searchKey);
        AppResponse<Page<Notification>> response = AppResponse.<Page<Notification>>builder()
                .localDateTime(LocalDateTime.now())
                .statusCode(200)
                .message("Admin notifications retrieved successfully")
                .data(notifications)
                .build();
        return ResponseEntity.ok(response);
    }
}
