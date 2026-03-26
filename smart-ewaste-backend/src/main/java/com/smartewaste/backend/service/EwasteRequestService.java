package com.smartewaste.backend.service;

import com.smartewaste.backend.dto.CreateEwasteRequest;
import com.smartewaste.backend.entity.EwasteRequest;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.RequestStatus;
import com.smartewaste.backend.repository.EwasteRequestRepository;
import com.smartewaste.backend.repository.UserAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.smartewaste.backend.service.AuditService;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.Instant;

@Service
public class EwasteRequestService {

    private final EwasteRequestRepository repository;
    private final UserAccountRepository userRepository;
    private final EmailService emailService;
    private final AuditService auditService;

    public EwasteRequestService(
            EwasteRequestRepository repository,
            UserAccountRepository userRepository,
            EmailService emailService,
            AuditService auditService
    ) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.auditService = auditService;
    }

    // ✅ Submit new request (Production Level)
    public EwasteRequest submitRequest(
            String email,
            CreateEwasteRequest dto,
            MultipartFile file
    ) {

        UserAccount user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getPickupDateTime() == null) {
            throw new RuntimeException("Pickup date & time is required");
        }

        EwasteRequest request = new EwasteRequest();
        request.setUser(user);
        request.setDeviceType(dto.getDeviceType());
        request.setBrand(dto.getBrand());
        request.setModel(dto.getModel());
        request.setCondition(dto.getCondition());
        request.setQuantity(dto.getQuantity());
        request.setPickupAddress(dto.getPickupAddress());
        request.setRemarks(dto.getRemarks());
        request.setStatus(RequestStatus.PENDING);
        request.setPickupDateTime(dto.getPickupDateTime());

        // Image handling (optional)
        if (file != null && !file.isEmpty()) {
            try {
                request.setImageData(file.getBytes());
                request.setImageName(file.getOriginalFilename());
                request.setImageType(file.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("Image upload failed");
            }
        }

        EwasteRequest savedRequest = repository.save(request);

        // Send confirmation email
        emailService.sendRequestSubmittedEmail(user.getEmail());

        return savedRequest;
    }

    // ✅ User Requests
    public Page<EwasteRequest> getUserRequests(String email, int page, int size) {

        UserAccount user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return repository.findByUser(user, pageable);
    }

    // ✅ Update Status (Admin Safe)
    public EwasteRequest updateStatus(Long id, RequestStatus newStatus) {

        EwasteRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() == RequestStatus.COMPLETED) {
            throw new RuntimeException("Cannot change status of completed request");
        }

        request.setStatus(newStatus);

        EwasteRequest saved = repository.save(request);

        // ✅ Send mail if approved
        if (newStatus == RequestStatus.APPROVED) {
            emailService.sendRequestApprovedEmail(
                    request.getUser().getEmail()
            );
        }

        // ✅ AUDIT LOG (NEW)
        auditService.log(
                "ADMIN",   // Later we can use real logged-in admin
                "UPDATE_STATUS_" + newStatus.name(),
                "REQUEST",
                request.getId()
        );

        return saved;
    }

    // ✅ Get All Requests
    public Page<EwasteRequest> getAllRequests(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return repository.findAll(pageable);
    }

    // ✅ Filter by Status
    public Page<EwasteRequest> getRequestsByStatus(
            RequestStatus status,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return repository.findByStatus(status, pageable);
    }

    public EwasteRequest schedulePickup(Long requestId, Instant scheduledAt) {

        EwasteRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.APPROVED) {
            throw new RuntimeException("Only approved requests can be scheduled");
        }

        if (scheduledAt.isBefore(Instant.now())) {
            throw new RuntimeException("Scheduled time must be in future");
        }

        request.setScheduledAt(scheduledAt);
        request.setStatus(RequestStatus.SCHEDULED);

        EwasteRequest saved = repository.save(request);

        // Send pickup scheduled email
        emailService.sendPickupScheduledEmail(
                request.getUser().getEmail(),
                scheduledAt
        );
        auditService.log(
                "ADMIN",
                "SCHEDULE_PICKUP",
                "REQUEST",
                request.getId()
        );

        return saved;
    }

    public EwasteRequest assignPersonnel(Long requestId, String personnelName) {

        EwasteRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // ✅ Relaxed check: Allow assignment if request is APPROVED or SCHEDULED
        if (request.getStatus() != RequestStatus.APPROVED && request.getStatus() != RequestStatus.SCHEDULED) {
            throw new RuntimeException("Personnel can only be assigned to approved or scheduled requests");
        }

        request.setAssignedPersonnel(personnelName);
        // NOTE: We keep the status as is, so it stays APPROVED or SCHEDULED
        // until explicitly moved to IN_PROGRESS by the staff member

        EwasteRequest saved = repository.save(request);

        // ✅ LOG (NEW)
        auditService.log(
                "ADMIN",
                "ASSIGN_PERSONNEL_" + personnelName,
                "REQUEST",
                request.getId()
        );

        return saved;
    }

    public Page<EwasteRequest> getStaffPickups(String personnelName, int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("scheduledAt").ascending()
        );

        return repository.findByAssignedPersonnel(personnelName, pageable);
    }
}
