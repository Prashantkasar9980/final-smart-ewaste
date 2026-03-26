package com.smartewaste.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ApproveUserRequest {

    @NotNull
    private Long userId;

    private boolean approve;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) { this.userId = userId; }

    public boolean isApprove() {
        return approve;
    }

    public void setApprove(boolean approve) { this.approve = approve; }
}