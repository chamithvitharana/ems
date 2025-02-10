package com.ems.service.service.impl;

import com.ems.commonlib.vo.NotificationVo;
import com.ems.service.integration.NotificationServiceClient;
import com.ems.service.service.NotificationService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationServiceClient notificationServiceClient;

    public NotificationServiceImpl(@Qualifier("com.ems.service.integration.NotificationServiceClient") NotificationServiceClient notificationServiceClient) {
        this.notificationServiceClient = notificationServiceClient;
    }

    @Override
    @Async
    public void sendEmail(NotificationVo notificationVo) {
        notificationServiceClient.sendEmail(notificationVo);
    }
}
