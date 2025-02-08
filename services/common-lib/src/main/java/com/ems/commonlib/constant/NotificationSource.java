package com.ems.commonlib.constant;

public enum NotificationSource {

    CUSTOMER_REGISTRATION(NotificationType.EMAIL, "customer-welcome-email.html", "Welcome to Our Service", null),

    AGENT_REGISTRATION(NotificationType.EMAIL, "agent-welcome-email.html", "System Access granted", null),
    PASSWORD_RESET(NotificationType.EMAIL_AND_SMS, "reset-password.html", "Password Reset", "password-reset-sms.txt"),
    ADMIN_NOTIFICATION(NotificationType.EMAIL_AND_SMS, "admin-notification-email.html", "EMS - Alert", "admin-notification-sms.txt"),
    BREAKDOWN_REPORTED_AGENT(NotificationType.EMAIL_AND_SMS, "breakdown-agent.html", "Breakdown - Alert", "breakdown-agent-sms.txt"),
    BREAKDOWN_REPORTED_CUSTOMER(NotificationType.EMAIL_AND_SMS, "breakdown-customer.html", "Breakdown - Alert", "breakdown-customer-sms.txt"),
    TRANSACTION_COMPLETED(NotificationType.EMAIL_AND_SMS, "transaction-completed.html", "EMS - Alert", "transaction-completed-sms.txt"),
    VEHICLE_REGISTRATION(NotificationType.EMAIL, "vehicle-added-email.html", "Your Vehicle Has Been Registered", null);

    private final NotificationType notificationType;
    private final String emailTemplateName;
    private final String subject;
    private final String smsTemplateName;

    // Constructor to initialize all fields
    NotificationSource(NotificationType notificationType, String emailTemplateName, String subject, String smsTemplateName) {
        this.notificationType = notificationType;
        this.emailTemplateName = emailTemplateName;
        this.subject = subject;
        this.smsTemplateName = smsTemplateName;
    }

    // Getter for NotificationType
    public NotificationType getNotificationType() {
        return notificationType;
    }

    // Getter for Email Template Name
    public String getEmailTemplateName() {
        return emailTemplateName;
    }

    // Getter for Subject
    public String getSubject() {
        return subject;
    }

    // Getter for SMS Template Name
    public String getSmsTemplateName() {
        return smsTemplateName;
    }
}
