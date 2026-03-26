package com.smartewaste.backend.service;

import com.smartewaste.backend.dto.RegisterUserRequest;
import com.smartewaste.backend.dto.UpdateProfileRequest;
import com.smartewaste.backend.dto.UserSummaryDto;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.entity.UserDocument;
import com.smartewaste.backend.enums.UserStatus;
import com.smartewaste.backend.repository.UserAccountRepository;
import com.smartewaste.backend.repository.UserDocumentRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserAccountRepository userAccountRepository;
    private final UserDocumentRepository userDocumentRepository;
    private final EmailService emailService;

    public UserService(
            UserAccountRepository userAccountRepository,
            UserDocumentRepository userDocumentRepository,
            EmailService emailService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.userDocumentRepository = userDocumentRepository;
        this.emailService = emailService;
    }

    // ============================
    // PUBLIC REGISTRATION (UNCHANGED)
    // ============================
    public UserAccount registerUser(RegisterUserRequest request) {

        if (userAccountRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        UserAccount user = new UserAccount();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setUsername(request.getEmail());
        user.setStatus(UserStatus.PENDING);
        user.setCreatedAt(Instant.now());
        user.getRoles().add("ROLE_USER");

        return userAccountRepository.save(user);
    }

    // ============================
    // USER PROFILE (FINAL)
    // ============================
    public UserAccount getProfile(String email) {
        return userAccountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void updateProfile(
            String email,
            UpdateProfileRequest request,
            MultipartFile idProof,
            MultipartFile addressProof
    ) throws IOException {

        UserAccount user = getProfile(email);

        // ✅ update basic details
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCity(request.getCity());
        user.setAddress(request.getAddress());

        userAccountRepository.save(user);

        // ✅ save documents if provided
        if (idProof != null && !idProof.isEmpty()) {
            saveDocument(user, idProof, "ID_PROOF");
        }

        if (addressProof != null && !addressProof.isEmpty()) {
            saveDocument(user, addressProof, "ADDRESS_PROOF");
        }
    }

    // ============================
    // ADMIN FUNCTIONS
    // ============================
    public List<UserSummaryDto> getAllUsers() {
        return userAccountRepository.findAll()
                .stream()
                .map(UserSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    public UserAccount approveUser(
            Long userId,
            boolean approve,
            String encodedTempPassword
    ) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (approve) {
            user.setStatus(UserStatus.VERIFIED);
            user.setPassword(encodedTempPassword);
            user.setMustResetPassword(true);
        } else {
            user.setStatus(UserStatus.REJECTED);
        }

        return userAccountRepository.save(user);
    }

    public String generateTempPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public void sendCredentials(UserAccount user, String rawTempPassword) {
        emailService.sendCredentialsEmail(
                user.getEmail(),
                user.getFullName(),
                rawTempPassword
        );
    }

    public UserAccount updateUserRole(Long userId, String role) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.getRoles().clear();
        user.getRoles().add(role);
        return userAccountRepository.save(user);
    }

    public List<UserSummaryDto> getAllStaff() {
        return userAccountRepository.findAll()
                .stream()
                .filter(u -> u.getRoles().contains("ROLE_STAFF"))
                .map(UserSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ============================
    // INTERNAL
    // ============================
    private void saveDocument(
            UserAccount user,
            MultipartFile file,
            String type
    ) throws IOException {

        UserDocument document = new UserDocument();
        document.setUser(user);
        document.setType(type);
        document.setFileName(file.getOriginalFilename());
        document.setContentType(file.getContentType());
        document.setData(file.getBytes());

        userDocumentRepository.save(document);
    }
}
