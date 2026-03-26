package com.smartewaste.backend.controller;

import com.smartewaste.backend.common.ApiResponse;
import com.smartewaste.backend.dto.AdminDashboardStatsDto;
import com.smartewaste.backend.service.AdminAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final AdminAnalyticsService service;

    public AdminAnalyticsController(AdminAnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getDashboard() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Dashboard statistics fetched successfully",
                        service.getDashboardStats()
                )
        );
    }
}