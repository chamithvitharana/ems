package com.ems.service.service.impl;

import com.ems.service.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Map;
import java.util.Properties;

@Service
public class EmailServiceImpl implements EmailService {

    private final TemplateEngine templateEngine;
    @Value("${email.account.enabled}")
    public Boolean ACCOUNT_ENABLED;
    @Value("${email.account.username}")
    public String USERNAME;
    @Value("${email.account.password}")
    public String PASSWORD;
    @Value("${email.account.from-email}")
    public String FROM_EMAIL;

    public EmailServiceImpl(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Override
    @Async
    public void send(String toEmail, String subject, String templateName, Map<String, Object> variables) {
        try {
            if (ACCOUNT_ENABLED) {
                Properties props = new Properties();
                props.put("mail.smtp.host", "smtp.gmail.com");
                props.put("mail.smtp.port", "587");
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");

                Session session = Session.getInstance(props, new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(USERNAME, PASSWORD);
                    }
                });

                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(FROM_EMAIL));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
                message.setSubject(subject);

                // Create Thymeleaf context with variables
                Context context = new Context();
                context.setVariables(variables);

                // Process the Thymeleaf template into HTML content
                String htmlContent = templateEngine.process(templateName, context);

                // Set HTML content
                message.setContent(htmlContent, "text/html; charset=utf-8");

                Transport.send(message);
            }
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
