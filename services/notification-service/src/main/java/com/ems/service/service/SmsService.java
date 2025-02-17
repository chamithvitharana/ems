package com.ems.service.service;

import com.ems.commonlib.vo.NotificationVo;

public interface SmsService {

    void sendSms(NotificationVo notificationVo);

    void send(String toNumber, String message);

}
