package com.ems.service.integration;

import com.ems.commonlib.vo.NotificationVo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class NotificationServiceFallback implements NotificationServiceClient {

    @Override
    public ResponseEntity<Boolean> sendEmail(NotificationVo notificationVo) {
        return null;
    }
}
