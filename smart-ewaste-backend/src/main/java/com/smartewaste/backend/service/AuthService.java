package com.smartewaste.backend.service;

import com.smartewaste.backend.dto.LoginRequest;
import com.smartewaste.backend.dto.LoginResponse;
import com.smartewaste.backend.dto.ResetPasswordRequest;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.UserStatus;
import com.smartewaste.backend.repository.UserAccountRepository;
import com.smartewaste.backend.security.JwtUtil;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserAccountRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            EmailService emailService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    // ✅ LOGIN (USERNAME OR EMAIL)
    public LoginResponse login(LoginRequest request) {

        String loginInput = request.getUsername();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginInput,
                            request.getPassword()
                    )
            );

            UserAccount user = userRepository
                    .findByUsernameIgnoreCase(loginInput)
                    .or(() -> userRepository.findByEmailIgnoreCase(loginInput))
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            // ✅ CORRECT STATUS CHECK
            if (user.getStatus() != UserStatus.VERIFIED) {
                return new LoginResponse(
                        false,
                        "Account not approved by admin yet.",
                        false,
                        null,
                        null,
                        null, null, null, null, null, null
                );
            }

            String role = user.getRoles()
                    .stream()
                    .findFirst()
                    .orElse("ROLE_USER");

            String token = jwtUtil.generateToken(user.getUsername(), role);

            return new LoginResponse(
                    true,
                    "Login successful",
                    user.isMustResetPassword(),
                    role,
                    token,
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getCity(),
                    user.getAddress()
            );

        } catch (BadCredentialsException ex) {
            return new LoginResponse(
                    false,
                    "Invalid username or password",
                    false,
                    null,
                    null,
                    null, null, null, null, null, null
            );
        }
    }

    // ✅ TEMP PASSWORD RESET
    public void resetPassword(ResetPasswordRequest request) {

        UserAccount user = userRepository
                .findByUsernameIgnoreCase(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (!user.isMustResetPassword()) {
            throw new IllegalStateException("Password reset not required");
        }

        if (!passwordEncoder.matches(request.getTempPassword(), user.getPassword())) {
            throw new BadCredentialsException("Temporary password incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustResetPassword(false);

        userRepository.save(user);

        emailService.sendPasswordChangedConfirmation(user.getEmail());
    }

    // ✅ FORGOT PASSWORD
    public void forgotPassword(String email, String frontendUrl) {

        UserAccount user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setResetTokenExpiry(Instant.now().plus(Duration.ofMinutes(30)));

        userRepository.save(user);

        String resetLink =
                frontendUrl + "/reset-password?token=" + token + "&email=" + email;

        emailService.sendPasswordResetEmail(email, resetLink);
    }

    // ✅ RESET PASSWORD USING EMAIL TOKEN
    public void resetPasswordWithToken(String email, String token, String newPassword) {

        UserAccount user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResetToken() == null ||
                !user.getResetToken().equals(token) ||
                user.getResetTokenExpiry().isBefore(Instant.now())) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        user.setMustResetPassword(false);

        userRepository.save(user);

        emailService.sendPasswordChangedConfirmation(email);
    }
}
