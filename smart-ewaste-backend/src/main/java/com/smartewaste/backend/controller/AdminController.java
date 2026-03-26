package com.smartewaste.backend.controller;

import com.smartewaste.backend.dto.ApproveUserRequest;
import com.smartewaste.backend.dto.RoleUpdateRequest;
import com.smartewaste.backend.dto.UserSummaryDto;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.service.UserService;
import com.smartewaste.backend.service.AuditService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public AdminController(
            UserService userService,
            PasswordEncoder passwordEncoder,
            AuditService auditService
    ) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.auditService=auditService;
    }

    // ✅ GET ALL USERS
    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDto>> listUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ APPROVE / REJECT USER
    @PostMapping("/users/approve")
    public ResponseEntity<String> approveUser(
            @Valid @RequestBody ApproveUserRequest request
    ) {
        String rawTempPassword = userService.generateTempPassword();
        String encodedTempPassword = passwordEncoder.encode(rawTempPassword);

        UserAccount user = userService.approveUser(
                request.getUserId(),
                request.isApprove(),
                encodedTempPassword
        );

        if (request.isApprove()) {
            userService.sendCredentials(user, rawTempPassword);
            return ResponseEntity.ok("User approved. Temporary password emailed.");
        }
        auditService.log(
                "ADMIN",
                request.isApprove() ? "APPROVE_USER" : "REJECT_USER",
                "USER",
                user.getId()
        );

        return ResponseEntity.ok("User rejected.");
    }

    // ✅ UPDATE USER ROLE
    @PostMapping("/users/role")
    public ResponseEntity<String> updateRole(
            @RequestBody RoleUpdateRequest request
    ) {
        userService.updateUserRole(request.getUserId(), request.getRole());
        return ResponseEntity.ok("Role updated successfully");
    }

    // ✅ GET ALL STAFF
    @GetMapping("/staff")
    public ResponseEntity<List<UserSummaryDto>> listStaff() {
        return ResponseEntity.ok(userService.getAllStaff());
    }
}
