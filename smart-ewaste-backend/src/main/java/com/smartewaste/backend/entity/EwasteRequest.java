package com.smartewaste.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartewaste.backend.enums.RequestStatus;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "ewaste_requests",
        indexes = {
                @Index(name = "idx_request_status", columnList = "status"),
                @Index(name = "idx_request_createdAt", columnList = "createdAt")
        })
public class EwasteRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Many requests belong to one user
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private UserAccount user;

    @Column(nullable = false, length = 255)
    private String deviceType;

    @Column(length = 255)
    private String brand;

    @Column(length = 255)
    private String model;

    @Column(name = "device_condition", nullable = false, length = 255)
    private String condition;

    @Column(nullable = false)
    private int quantity;

    @Column(length = 1000, nullable = false)
    private String pickupAddress;

    @Column(name = "pickup_date_time")
    private LocalDateTime pickupDateTime;

    @Column(length = 2000)
    private String remarks;

    // 🔥 IMAGE SUPPORT
    private String imageName;

    private String imageType;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @JsonIgnore
    private byte[] imageData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant scheduledAt;

    @Column(length = 255)
    private String assignedPersonnel;

    // ==========================
    // AUTO TIMESTAMP & DEFAULTS
    // ==========================
    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();

        if (this.status == null) {
            this.status = RequestStatus.PENDING;
        }
    }

    // ==========================
    // GETTERS & SETTERS
    // ==========================

    public Long getId() { return id; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public LocalDateTime getPickupDateTime() { return pickupDateTime; }
    public void setPickupDateTime(LocalDateTime pickupDateTime) { this.pickupDateTime = pickupDateTime; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getImageName() { return imageName; }
    public void setImageName(String imageName) { this.imageName = imageName; }

    public String getImageType() { return imageType; }
    public void setImageType(String imageType) { this.imageType = imageType; }

    public byte[] getImageData() { return imageData; }
    public void setImageData(byte[] imageData) { this.imageData = imageData; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }

    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }

    public String getAssignedPersonnel() {
        return assignedPersonnel;
    }

    public void setAssignedPersonnel(String assignedPersonnel) {
        this.assignedPersonnel = assignedPersonnel;
    }


}