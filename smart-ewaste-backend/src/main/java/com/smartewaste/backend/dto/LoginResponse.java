package com.smartewaste.backend.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private boolean mustResetPassword;
    private String role;
    private String token;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String city;
    private String address;

    // ✅ REQUIRED constructor (THIS FIXES THE ERROR)
    public LoginResponse(boolean success,
                         String message,
                         boolean mustResetPassword,
                         String role,
                         String token,
                         Long userId,
                         String fullName,
                         String email,
                         String phone,
                         String city,
                         String address) {
        this.success = success;
        this.message = message;
        this.mustResetPassword = mustResetPassword;
        this.role = role;
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.city = city;
        this.address = address;
    }

    // ✅ Default constructor (important for Jackson)
    public LoginResponse() {}

    // ✅ Getters & Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isMustResetPassword() {
        return mustResetPassword;
    }

    public void setMustResetPassword(boolean mustResetPassword) {
        this.mustResetPassword = mustResetPassword;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
