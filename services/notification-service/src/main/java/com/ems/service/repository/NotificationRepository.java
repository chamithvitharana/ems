package com.ems.service.repository;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.entity.notification.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findAllByNotificationSource(Pageable pageable, NotificationSource notificationSource);

    Page<Notification> findAllByIsCustomerNotification(Pageable pageable, Boolean isCustomerNotifications);

    Page<Notification> findAllByIsAgentNotification(Pageable pageable, Boolean isAgentNotifications);

    Page<Notification> findAllByNotificationSourceAndContentIsLike(Pageable pageable, NotificationSource adminNotification, String searchKey);
}
