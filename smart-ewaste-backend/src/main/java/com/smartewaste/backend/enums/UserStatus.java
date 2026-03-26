package com.smartewaste.backend.enums;

public enum UserStatus {
    PENDING,     // Registered, waiting for admin approval
    VERIFIED,    // Approved by admin → can login
    REJECTED    // Rejected by admin
}
