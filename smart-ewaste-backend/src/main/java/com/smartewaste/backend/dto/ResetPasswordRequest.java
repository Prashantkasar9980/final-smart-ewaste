package com.smartewaste.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String tempPassword;

    @NotBlank
    @Size(min = 8)
    private String newPassword;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) { this.username = username; }

    public String getTempPassword() {
        return tempPassword;
    }

    public void setTempPassword(String tempPassword) { this.tempPassword = tempPassword; }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}