package com.ems.service.service;

import com.ems.commonlib.vo.NotificationVo;

public interface NotificationService {
    void sendEmail(NotificationVo notificationVo);

}
