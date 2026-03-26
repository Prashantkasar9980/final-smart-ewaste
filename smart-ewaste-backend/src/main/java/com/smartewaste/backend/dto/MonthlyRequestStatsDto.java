package com.smartewaste.backend.dto;

public class MonthlyRequestStatsDto {

    private String month;
    private Long count;   // ✅ Use Long (wrapper)

    // ✅ REQUIRED constructor for JPQL
    public MonthlyRequestStatsDto(String month, Long count) {
        this.month = month;
        this.count = count;
    }

    // Default constructor
    public MonthlyRequestStatsDto() {
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}