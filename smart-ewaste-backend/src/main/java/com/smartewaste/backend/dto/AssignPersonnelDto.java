package com.smartewaste.backend.dto;

import jakarta.validation.constraints.*;
public class AssignPersonnelDto {

    @NotBlank(message = "Personnel name required")
    private String personnelName;

    public String getPersonnelName() {
        return personnelName;
    }

    public void setPersonnelName(String personnelName) {
        this.personnelName = personnelName;
    }
}