package com.ems.service.service.impl;

import com.ems.commonlib.constant.NotificationSource;
import com.ems.commonlib.dto.auth.request.SignUpRequest;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.accespoint.AccessPoint;
import com.ems.commonlib.entity.agent.Agent;
import com.ems.commonlib.entity.auth.User;
import com.ems.commonlib.vo.NotificationVo;
import com.ems.service.integration.accesspoint.AccessPointServiceClient;
import com.ems.service.integration.auth.AuthServiceClient;
import com.ems.service.integration.notification.NotificationServiceClient;
import com.ems.service.repository.AgentRepository;
import com.ems.service.service.AgentService;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AgentServiceImpl implements AgentService {

    @Value("${agent.default.password}")
    private String defaultAgentPassword;

    private final AgentRepository agentRepository;

    private final AuthServiceClient authServiceClient;

    private final NotificationServiceClient notificationServiceClient;

    private final AccessPointServiceClient accessPointServiceClient;

    private final TemplateEngine templateEngine;

    public AgentServiceImpl(AgentRepository agentRepository,
                            @Qualifier("com.ems.service.integration.auth.AuthServiceClient") AuthServiceClient authServiceClient,
                            @Qualifier("com.ems.service.integration.notification.NotificationServiceClient") NotificationServiceClient notificationServiceClient, AccessPointServiceClient accessPointServiceClient, TemplateEngine templateEngine) {
        this.agentRepository = agentRepository;
        this.authServiceClient = authServiceClient;
        this.notificationServiceClient = notificationServiceClient;
        this.accessPointServiceClient = accessPointServiceClient;
        this.templateEngine = templateEngine;
    }

    @Override
    public Agent save(Agent agent) {

        ResponseEntity<AppResponse<Optional<AccessPoint>>> accessPoint = accessPointServiceClient.getById(agent.getAccessPointId());
        agent.setAccessPointName(accessPoint.getBody().getData().get().getName());
        Agent save = agentRepository.save(agent);

        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setPassword(defaultAgentPassword);
        signUpRequest.setEmail(agent.getEmail());
        signUpRequest.setName(agent.getName());
        signUpRequest.setEmailNotificationEnabled(true);
        signUpRequest.setSmsNotificationEnabled(true);
        signUpRequest.setPaymentId(agent.getContactNumber());
        signUpRequest.setAgentId(save.getId());
        ResponseEntity<AppResponse<User>> appResponseResponseEntity = authServiceClient.signUp(signUpRequest);

        if(Objects.requireNonNull(appResponseResponseEntity.getBody()).getStatusCode() != 201) {
            agentRepository.delete(save);
            throw new RuntimeException("User Already exists");
        }

        agent.setUserAccountsId(appResponseResponseEntity.getBody().getData().getId());

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", agent.getName());
        variables.put("email", agent.getEmail());
        variables.put("password", signUpRequest.getPassword());
        variables.put("accessPointName", Objects.requireNonNull(accessPoint.getBody()).getData().orElseThrow().getName());

        // send email
        notificationServiceClient.sendEmail(
                NotificationVo
                        .builder()
                        .notificationSource(NotificationSource.AGENT_REGISTRATION)
                        .toEmails(Collections.singletonList(save.getEmail()))
                        .variables(variables)
                        .build()
        );

        return agentRepository.save(save);
    }

    @Override
    public Page<Agent> getPageBySearchKey(Integer size, Integer page, String searchKey) {

        if (searchKey != null) {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
            return agentRepository.findBySearchKey(searchKey, pageable);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return agentRepository.findAll(pageable);
    }

    @Override
    public Optional<Agent> getById(Long id) {
        return agentRepository.findById(id);
    }

    @Override
    public Agent update(Agent requestDto) {
        ResponseEntity<AppResponse<Optional<AccessPoint>>> accessPoint = accessPointServiceClient.getById(requestDto.getAccessPointId());
        requestDto.setAccessPointName(accessPoint.getBody().getData().get().getName());
        return agentRepository.save(requestDto);
    }

    @Override
    public ByteArrayInputStream generateReport() {
        try {

            List<Agent> agents = agentRepository.findAll();

            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("agents", agents);

            // Add generated date
            String generatedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));
            context.setVariable("generatedDate", generatedDate);

            // Load and encode the logo image as Base64
            ClassPathResource imgFile = new ClassPathResource("static/ems-logo.png");
            byte[] imageBytes = Files.readAllBytes(imgFile.getFile().toPath());
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String dataUri = "data:image/png;base64," + base64Image;
            context.setVariable("logo", dataUri);

            // Render HTML content using Thymeleaf
            String htmlContent = templateEngine.process("report", context);

            // Create PDF using OpenHTMLToPDF
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();

            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (Exception e) {
            // Log the exception (consider using a logger)
            e.printStackTrace();
            throw new RuntimeException("Error while generating PDF", e);
        }
    }
}
