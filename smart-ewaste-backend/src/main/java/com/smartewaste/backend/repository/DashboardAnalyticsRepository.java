package com.smartewaste.backend.repository;

import com.smartewaste.backend.entity.EwasteRequest;
import com.smartewaste.backend.enums.RequestStatus;
import com.smartewaste.backend.enums.UserStatus;
import com.smartewaste.backend.dto.MonthlyRequestStatsDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface DashboardAnalyticsRepository extends JpaRepository<EwasteRequest, Long> {

    // ================= REQUEST COUNTS =================

    long countByStatus(RequestStatus status);

    long countByCreatedAtBetween(Instant start, Instant end);

    @Query("SELECT COUNT(r) FROM EwasteRequest r WHERE r.scheduledAt IS NOT NULL AND r.status <> 'COMPLETED'")
    long countScheduledNotCompleted();

    @Query("SELECT COUNT(r) FROM EwasteRequest r WHERE r.scheduledAt < CURRENT_TIMESTAMP AND r.status <> 'COMPLETED'")
    long countOverdueRequests();

    // ================= USER COUNTS =================

    @Query("SELECT COUNT(u) FROM UserAccount u")
    long countTotalUsers();

    @Query("SELECT COUNT(u) FROM UserAccount u WHERE u.status = :status")
    long countUsersByStatus(UserStatus status);

    // ================= MONTHLY STATS =================
    @Query("""
    SELECT 
        YEAR(r.createdAt),
        MONTH(r.createdAt),
        COUNT(r)
    FROM EwasteRequest r
    WHERE r.createdAt >= :startDate
    GROUP BY YEAR(r.createdAt), MONTH(r.createdAt)
    ORDER BY YEAR(r.createdAt), MONTH(r.createdAt)
""")
    List<Object[]> getMonthlyStatsRaw(Instant startDate);
}