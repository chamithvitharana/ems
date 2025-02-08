package com.ems.service.controller;

import com.ems.commonlib.constant.Status;
import com.ems.commonlib.dto.auth.request.*;
import com.ems.commonlib.dto.auth.response.AuthResponse;
import com.ems.commonlib.dto.general.AppResponse;
import com.ems.commonlib.entity.agent.Agent;
import com.ems.commonlib.entity.auth.User;
import com.ems.commonlib.entity.auth.UserRole;
import com.ems.commonlib.entity.auth.UserRoles;
import com.ems.commonlib.entity.auth.UserStatuses;
import com.ems.commonlib.entity.customer.Customer;
import com.ems.service.integration.agent.AgentServiceClient;
import com.ems.service.integration.customer.CustomerServiceClient;
import com.ems.service.service.CustomUserDetailsService;
import com.ems.service.service.UserService;
import com.ems.service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomerServiceClient customerServiceClient;
    private final AgentServiceClient agentServiceClient;
    private final CustomUserDetailsService userDetailsService;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          @Qualifier("com.ems.service.integration.customer.CustomerServiceClient") CustomerServiceClient customerServiceClient,
                          @Qualifier("com.ems.service.integration.agent.AgentServiceClient") AgentServiceClient agentServiceClient,
                          CustomUserDetailsService userDetailsService,
                          UserService userService,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.customerServiceClient = customerServiceClient;
        this.agentServiceClient = agentServiceClient;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AppResponse<AuthResponse>> createAuthenticationToken(@RequestBody AuthRequest authRequest) {
        AppResponse<AuthResponse> response = new AppResponse<>();
        try {
            Optional<User> user = userService.findByUsername(authRequest.getUsername());

            if (user.isPresent() && user.get().getStatus() == UserStatuses.ACTIVE) {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
                );

                final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());

                AuthResponse authResponse = AuthResponse.builder()
                        .accessToken(jwtUtil.generateAccessToken(
                                userDetails,
                                userDetails.getAuthorities().toArray()[0].toString())
                        )
                        .email(user.get().getEmail())
                        .username(user.get().getUsername())
                        .userRole(user.get().getRole().getCode())
                        .build();

                if(user.get().getCustomerId() != null) {
                    Customer customer = customerServiceClient.getById(String.valueOf(user.get().getCustomerId())).getBody().getData().get();
                    if(customer.getStatus() == Status.INACTIVE) {
                        response.setStatusCode(400);
                        response.setMessage("Disabled account");
                        return ResponseEntity.status(response.getStatusCode()).body(response);
                    }

                    authResponse.setCustomer(Objects.requireNonNull(customer));
                } else if (user.get().getAgentId() != null) {
                    Agent agent = agentServiceClient.getById(String.valueOf(user.get().getAgentId())).getBody().getData().get();
                    if(agent.getStatus() == Status.INACTIVE) {
                        response.setStatusCode(400);
                        response.setMessage("Disabled account");
                        return ResponseEntity.status(response.getStatusCode()).body(response);
                    }

                    authResponse.setAgent(Objects.requireNonNull(agent));
                }

                response.setStatusCode(200);
                response.setMessage("Login successful");
                response.setData(authResponse);

            } else {
                response.setStatusCode(400);
                response.setMessage("Incorrect username or inactive account");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to authenticate: " + e.getMessage());
        }
        response.setLocalDateTime(LocalDateTime.now());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<AppResponse<Boolean>> validate(@RequestParam("token") String token) {
        AppResponse<Boolean> response = new AppResponse<>();
        try {
            response.setStatusCode(200);
            response.setData(jwtUtil.validateToken(token));
            response.setMessage("Token validation successful");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to validate token: " + e.getMessage());
        }
        response.setLocalDateTime(LocalDateTime.now());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/customer/sign-up")
    public ResponseEntity<AppResponse<String>> customerSignUp(@RequestBody SignUpRequest request) {
        AppResponse<String> response = new AppResponse<>();
        try {
            Optional<User> user = userService.findByEmail(request.getEmail());
            AppResponse<Optional<Customer>> nic = customerServiceClient.getByNic(request.getNic()).getBody();

            if (user.isPresent() || (nic != null && nic.getData() != null && nic.getData().isPresent())) {
                response.setStatusCode(400);
                response.setMessage("User already exists");
            } else {
                User newUser = userService.createUser(request.getUser());
                ResponseEntity<AppResponse<Optional<Customer>>> save = customerServiceClient.save(request.getCustomer(newUser));
                newUser.setCustomerId(save.getBody().getData().get().getId());
                userService.update(newUser);

                response.setStatusCode(201);
                response.setMessage("Sign-up successful");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to sign up: " + e.getMessage());
        }
        response.setLocalDateTime(LocalDateTime.now());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/customer/update")
    public ResponseEntity<AppResponse<String>> customerUpdate(@RequestBody SignUpRequest request) {
        AppResponse<String> response = new AppResponse<>();
        try {
            // Check if the user exists by email
            Optional<User> optionalUser = userService.findByEmail(request.getEmail());
            User user = null;

            // Check if the customer exists by NIC
            AppResponse<Optional<Customer>> customerResponse = customerServiceClient.getByNic(request.getNic()).getBody();

            if (optionalUser.isPresent()) {
                // User exists, update the user
                user = optionalUser.get();
                user.setContactNumber(request.getPhoneNumber());
                user.setEmail(request.getEmail());
                user.setUsername(request.getEmail());
                userService.update(user);
            }

            if (customerResponse != null && customerResponse.getData().isPresent()) {
                // Customer exists, update the customer
                Customer existingCustomer = customerResponse.getData().get();
                existingCustomer.setName(request.getName());
                existingCustomer.setAddressLine1(request.getAddressLine1());
                existingCustomer.setAddressLine2(request.getAddressLine2());
                existingCustomer.setContactNumber(request.getPhoneNumber());
                existingCustomer.setSmsNotificationEnabled(request.isSmsNotificationEnabled());
                existingCustomer.setEmailNotificationEnabled(request.isEmailNotificationEnabled());
                existingCustomer.setPaymentId(request.getPaymentId());

                // Save the updated customer via the customer service client
                customerServiceClient.update(existingCustomer);
            }

            // Set success response
            response.setStatusCode(201);
            response.setMessage("Customer update successful");

        } catch (Exception e) {
            // Handle exceptions and set error response
            response.setStatusCode(500);
            response.setMessage("Failed to update customer: " + e.getMessage());
        }

        response.setLocalDateTime(LocalDateTime.now());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/agent/sign-up")
    public ResponseEntity<AppResponse<User>> agentSignUp(@RequestBody SignUpRequest request) {
        AppResponse<User> response = new AppResponse<>();
        try {
            Optional<User> user = userService.findByEmail(request.getEmail());

            if (user.isPresent()) {
                response.setStatusCode(400);
                response.setMessage("User already exists");
            } else {
                User requestUser = request.getUser();
                UserRole role = new UserRole();
                role.setCode(UserRoles.AGENT);
                requestUser.setRole(role);

                User newUser = userService.createUser(requestUser);

                response.setStatusCode(201);
                response.setMessage("Sign-up successful");
                response.setData(newUser);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to sign up: " + e.getMessage());
        }
        response.setLocalDateTime(LocalDateTime.now());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/send-reset-code")
    public ResponseEntity<AppResponse<String>> sendResetCode(@RequestBody SendResetCodeRequestDto request) {
        AppResponse<String> response = new AppResponse<>();
        try {
            userService.sendResetCode(request.getEmail());
            response.setStatusCode(200);
            response.setMessage("Reset code sent to email");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to send reset code: " + e.getMessage());
        }
        response.setLocalDateTime(LocalDateTime.now());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<AppResponse<String>> verifyResetCode(@RequestBody VerifyResetCodeRequestDto request) {
        AppResponse<String> response = new AppResponse<>();
        try {
            User user = userService.findByEmail(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (user.getResetCode() != null && user.getResetCode().equals(request.getResetCode()) && user.getResetCodeExpiration().isAfter(LocalDateTime.now())) {
                response.setStatusCode(200);
                response.setMessage("Code verified");
            } else {
                response.setStatusCode(400);
                response.setMessage("Invalid or expired code");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to verify reset code: " + e.getMessage());
        }
        response.setLocalDateTime(LocalDateTime.now());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AppResponse<String>> resetPassword(@RequestBody ResetPasswordRequestDto request) {
        AppResponse<String> response = new AppResponse<>();
        try {

            User user = userService.findByEmail(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (user.getResetCode() != null && user.getResetCode().equals(request.getResetCode()) && user.getResetCodeExpiration().isAfter(LocalDateTime.now())) {
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                user.setResetCode(null);
                user.setResetCodeExpiration(null);
                userService.update(user);

                response.setStatusCode(200);
                response.setMessage("Password reset successful");
            } else {
                response.setStatusCode(400);
                response.setMessage("Invalid or expired code");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to reset password: " + e.getMessage());
        }
        response.setLocalDateTime(LocalDateTime.now());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
