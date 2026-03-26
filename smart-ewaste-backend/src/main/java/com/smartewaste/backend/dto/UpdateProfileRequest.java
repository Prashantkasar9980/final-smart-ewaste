package com.smartewaste.backend.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    private String fullName;

    private String email;

    private String phone;

    @Size(max = 255)
    private String city;

    @Size(max = 1000)
    private String address;

    // ========= getters & setters =========

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
