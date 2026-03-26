package com.smartewaste.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class SchedulePickupRequestDto {

    @NotNull(message = "Scheduled date & time is required")
    @Future(message = "Pickup time must be in future")
    private Instant scheduledAt;

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
    }
}