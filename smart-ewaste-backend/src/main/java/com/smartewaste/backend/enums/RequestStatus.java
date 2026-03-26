package com.smartewaste.backend.enums;

public enum RequestStatus {

    PENDING,        // User submitted request
    APPROVED,       // Admin approved
    REJECTED,       // Admin rejected
    SCHEDULED,
    IN_PROGRESS,    // Pickup started
    COMPLETED       // Pickup finished
}