package com.smartewaste.backend.service;

import com.smartewaste.backend.dto.AdminDashboardStatsDto;
import com.smartewaste.backend.dto.MonthlyRequestStatsDto;
import com.smartewaste.backend.enums.RequestStatus;
import com.smartewaste.backend.enums.UserStatus;
import com.smartewaste.backend.repository.DashboardAnalyticsRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

import java.time.*;
import java.util.List;

@Service
public class AdminAnalyticsService {

    private final DashboardAnalyticsRepository repository;

    public AdminAnalyticsService(DashboardAnalyticsRepository repository) {
        this.repository = repository;
    }

    public AdminDashboardStatsDto getDashboardStats() {

        AdminDashboardStatsDto dto = new AdminDashboardStatsDto();

        // ================= REQUEST METRICS =================
        dto.setTotalRequests(repository.count());
        dto.setPendingRequests(repository.countByStatus(RequestStatus.PENDING));
        dto.setApprovedRequests(repository.countByStatus(RequestStatus.APPROVED));
        dto.setRejectedRequests(repository.countByStatus(RequestStatus.REJECTED));
        dto.setInProgressRequests(repository.countByStatus(RequestStatus.IN_PROGRESS));
        dto.setCompletedRequests(repository.countByStatus(RequestStatus.COMPLETED));

        // ================= USER METRICS =================
        dto.setTotalUsers(repository.countTotalUsers());
        dto.setPendingUsers(repository.countUsersByStatus(UserStatus.PENDING));
        dto.setVerifiedUsers(repository.countUsersByStatus(UserStatus.VERIFIED));
        dto.setRejectedUsers(repository.countUsersByStatus(UserStatus.REJECTED));

        // ================= TIME METRICS =================
        Instant now = Instant.now();

        Instant startOfDay = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant startOfWeek = LocalDate.now().minusDays(7).atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        dto.setTodayRequests(repository.countByCreatedAtBetween(startOfDay, now));
        dto.setWeekRequests(repository.countByCreatedAtBetween(startOfWeek, now));
        dto.setMonthRequests(repository.countByCreatedAtBetween(startOfMonth, now));

        // ================= OPERATIONAL =================
        dto.setScheduledNotCompleted(repository.countScheduledNotCompleted());
        dto.setOverdueRequests(repository.countOverdueRequests());

        // ================= MONTHLY CHART =================
        Instant sixMonthsAgo = LocalDate.now()
                .minusMonths(6)
                .withDayOfMonth(1)
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant();

        List<Object[]> results = repository.getMonthlyStatsRaw(sixMonthsAgo);

        List<MonthlyRequestStatsDto> monthlyStats = new ArrayList<>();

        for (Object[] row : results) {

            Integer year = (Integer) row[0];
            Integer month = (Integer) row[1];
            Long count = (Long) row[2];

            String formattedMonth = year + "-" + String.format("%02d", month);

            monthlyStats.add(new MonthlyRequestStatsDto(formattedMonth, count));
        }

        dto.setMonthlyStats(monthlyStats);

        return dto;
    }
}