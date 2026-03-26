package com.smartewaste.backend.repository;

import com.smartewaste.backend.entity.EwasteRequest;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EwasteRequestRepository extends JpaRepository<EwasteRequest, Long> {

    // 🔹 Pagination for user
    Page<EwasteRequest> findByUser(UserAccount user, Pageable pageable);

    // 🔹 Filter by status (Admin use)
    Page<EwasteRequest> findByStatus(RequestStatus status, Pageable pageable);

    // 🔹 For Staff Portal
    Page<EwasteRequest> findByAssignedPersonnel(String personnelName, Pageable pageable);
}