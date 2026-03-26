package com.smartewaste.backend.dto;

import java.util.List;

public class AdminDashboardStatsDto {

    // Request Metrics
    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long rejectedRequests;
    private long inProgressRequests;
    private long completedRequests;

    // User Metrics
    private long totalUsers;
    private long pendingUsers;
    private long verifiedUsers;
    private long rejectedUsers;

    // Time Metrics
    private long todayRequests;
    private long weekRequests;
    private long monthRequests;

    // Operational Metrics
    private long scheduledNotCompleted;
    private long overdueRequests;

    // Chart Data
    private List<MonthlyRequestStatsDto> monthlyStats;

    // Getters & Setters (Generate in IDE)


    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getApprovedRequests() {
        return approvedRequests;
    }

    public void setApprovedRequests(long approvedRequests) {
        this.approvedRequests = approvedRequests;
    }

    public long getCompletedRequests() {
        return completedRequests;
    }

    public void setCompletedRequests(long completedRequests) {
        this.completedRequests = completedRequests;
    }

    public long getInProgressRequests() {
        return inProgressRequests;
    }

    public void setInProgressRequests(long inProgressRequests) {
        this.inProgressRequests = inProgressRequests;
    }

    public List<MonthlyRequestStatsDto> getMonthlyStats() {
        return monthlyStats;
    }

    public void setMonthlyStats(List<MonthlyRequestStatsDto> monthlyStats) {
        this.monthlyStats = monthlyStats;
    }

    public long getMonthRequests() {
        return monthRequests;
    }

    public void setMonthRequests(long monthRequests) {
        this.monthRequests = monthRequests;
    }

    public long getOverdueRequests() {
        return overdueRequests;
    }

    public void setOverdueRequests(long overdueRequests) {
        this.overdueRequests = overdueRequests;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getPendingUsers() {
        return pendingUsers;
    }

    public void setPendingUsers(long pendingUsers) {
        this.pendingUsers = pendingUsers;
    }

    public long getRejectedRequests() {
        return rejectedRequests;
    }

    public void setRejectedRequests(long rejectedRequests) {
        this.rejectedRequests = rejectedRequests;
    }

    public long getRejectedUsers() {
        return rejectedUsers;
    }

    public void setRejectedUsers(long rejectedUsers) {
        this.rejectedUsers = rejectedUsers;
    }

    public long getScheduledNotCompleted() {
        return scheduledNotCompleted;
    }

    public void setScheduledNotCompleted(long scheduledNotCompleted) {
        this.scheduledNotCompleted = scheduledNotCompleted;
    }

    public long getTodayRequests() {
        return todayRequests;
    }

    public void setTodayRequests(long todayRequests) {
        this.todayRequests = todayRequests;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getVerifiedUsers() {
        return verifiedUsers;
    }

    public void setVerifiedUsers(long verifiedUsers) {
        this.verifiedUsers = verifiedUsers;
    }

    public long getWeekRequests() {
        return weekRequests;
    }

    public void setWeekRequests(long weekRequests) {
        this.weekRequests = weekRequests;
    }
}