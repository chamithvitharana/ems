package com.ems.commonlib.entity.notification;

import com.ems.commonlib.BaseEntity;
import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.constant.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Notifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @Enumerated(EnumType.STRING)
    private NotificationSource notificationSource;

    @Column(name = "transactions_id")
    private Long transaction_id;

    @Column(name = "is_customer_notification")
    private boolean isCustomerNotification;

    @Column(name = "is_agent_notification")
    private boolean isAgentNotification;

}
