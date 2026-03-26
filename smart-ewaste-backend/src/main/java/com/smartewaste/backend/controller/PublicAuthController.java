package com.smartewaste.backend.controller;

import com.smartewaste.backend.dto.LoginRequest;
import com.smartewaste.backend.dto.LoginResponse;
import com.smartewaste.backend.dto.RegisterUserRequest;
import com.smartewaste.backend.dto.ResetPasswordRequest;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.service.AuthService;
import com.smartewaste.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicAuthController {

    private final UserService userService;
    private final AuthService authService;

    public PublicAuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    // ✅ USER REGISTRATION — JSON ONLY (fullName, email, phone)
    @PostMapping(
            value = "/users/register",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterUserRequest request
    ) {
        UserAccount user = userService.registerUser(request);

        return ResponseEntity.ok(
                "Registration submitted. Your reference id is " + user.getId()
        );
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ✅ RESET PASSWORD (TEMP PASSWORD FLOW)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password updated.");
    }

    // ✅ FORGOT PASSWORD (EMAIL LINK)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> body
    ) {
        authService.forgotPassword(
                body.get("email"),
                "http://localhost:3000"
        );
        return ResponseEntity.ok("Password reset link sent.");
    }

    // ✅ RESET PASSWORD USING EMAIL LINK
    @PostMapping("/reset-password-link")
    public ResponseEntity<?> resetPasswordWithLink(
            @RequestBody Map<String, String> body
    ) {
        authService.resetPasswordWithToken(
                body.get("email"),
                body.get("token"),
                body.get("newPassword")
        );
        return ResponseEntity.ok("Password reset successful.");
    }
}
