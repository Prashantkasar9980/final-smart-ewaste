package com.smartewaste.backend.controller;

import com.smartewaste.backend.common.ApiResponse;
import com.smartewaste.backend.dto.CreateEwasteRequest;
import com.smartewaste.backend.entity.EwasteRequest;
import com.smartewaste.backend.enums.RequestStatus;
import com.smartewaste.backend.service.EmailService;
import com.smartewaste.backend.service.EwasteRequestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.smartewaste.backend.dto.AssignPersonnelDto;
import java.time.Instant;

@RestController
@RequestMapping("/api")
public class EwasteRequestController {

    private final EwasteRequestService service;
    private final EmailService emailService;

    public EwasteRequestController(EwasteRequestService service,
                                   EmailService emailService) {
        this.service = service;
        this.emailService = emailService;
    }

    // ==========================
    // USER ENDPOINTS
    // ==========================

    @PostMapping(
            value = "/user/ewaste",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<?>> submitRequest(
            @AuthenticationPrincipal UserDetails userDetails,

            @Valid
            @RequestPart("dto") CreateEwasteRequest request,

            @RequestPart(value = "file", required = false)
            MultipartFile file
    ) {

        EwasteRequest savedRequest =
                service.submitRequest(userDetails.getUsername(), request, file);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "E-waste request submitted successfully",
                        savedRequest
                )
        );
    }

    @GetMapping("/user/ewaste")
    public ResponseEntity<ApiResponse<?>> myRequests(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {

        Page<EwasteRequest> requests =
                service.getUserRequests(userDetails.getUsername(), page, size);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Requests fetched successfully",
                        requests
                )
        );
    }

    // ==========================
    // ADMIN ENDPOINTS
    // ==========================

    @PutMapping("/admin/ewaste/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status
    ) {

        EwasteRequest updatedRequest = service.updateStatus(id, status);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Status updated successfully",
                        updatedRequest
                )
        );
    }

    @GetMapping("/admin/ewaste")
    public ResponseEntity<ApiResponse<?>> allRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) RequestStatus status
    ) {

        Page<EwasteRequest> requests;

        if (status != null) {
            requests = service.getRequestsByStatus(status, page, size);
        } else {
            requests = service.getAllRequests(page, size);
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Admin requests fetched successfully",
                        requests
                )
        );
    }

    @PutMapping("/admin/ewaste/{id}/assign")
    public ResponseEntity<ApiResponse<?>> assignPersonnel(
            @PathVariable Long id,
            @Valid @RequestBody AssignPersonnelDto dto
    ) {

        EwasteRequest updated =
                service.assignPersonnel(id, dto.getPersonnelName());

        return ResponseEntity.ok(
                ApiResponse.success("Personnel assigned", updated)
        );
    }

    @PutMapping("/admin/ewaste/{id}/schedule")
    public ResponseEntity<ApiResponse<?>> schedulePickup(
            @PathVariable Long id,
            @RequestParam Instant scheduledAt
    ) {
        EwasteRequest updatedRequest = service.schedulePickup(id, scheduledAt);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "E-waste request scheduled successfully",
                        updatedRequest
                )
        );
    }
}