package com.smartewaste.backend.controller;

import com.smartewaste.backend.dto.UpdateProfileRequest;
import com.smartewaste.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("data") UpdateProfileRequest request,
            @RequestPart(value = "idProof", required = false) MultipartFile idProof,
            @RequestPart(value = "addressProof", required = false) MultipartFile addressProof
    ) throws Exception {

        userService.updateProfile(
                userDetails.getUsername(), // ✅ EMAIL from JWT
                request,
                idProof,
                addressProof
        );

        return ResponseEntity.ok("Profile updated successfully");
    }
}

