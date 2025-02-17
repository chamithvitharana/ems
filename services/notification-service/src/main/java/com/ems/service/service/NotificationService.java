package com.ems.service.service;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.entity.notification.Notification;
import org.springframework.data.domain.Page;

public interface NotificationService {

    void sendAndSave(Notification notification);

    Page<Notification> getPage(Integer size, Integer page);

    Page<Notification> getPageByNotificationSource(Integer size, Integer page, NotificationSource adminNotification, String searchKey);

    Page<Notification> getCustomerPage(Integer size, Integer page);

    Page<Notification> getAgentPage(Integer size, Integer page);

}
