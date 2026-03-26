package com.smartewaste.backend.dto;

import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.UserStatus;
import java.time.Instant;
import java.util.Set;

public class UserSummaryDto {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private UserStatus status;
    private Set<String> roles;
    private Instant createdAt;

    // ✅ REQUIRED getters
    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public UserStatus getStatus() {
        return status;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    // ✅ Mapper
    public static UserSummaryDto fromEntity(UserAccount user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.id = user.getId();
        dto.fullName = user.getFullName();
        dto.email = user.getEmail();
        dto.phone = user.getPhone();
        dto.status = user.getStatus();
        dto.roles = user.getRoles();
        dto.createdAt = user.getCreatedAt();
        return dto;
    }
}
