package com.smartewaste.backend.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "audit_logs",
        indexes = {
                @Index(name = "idx_audit_actor", columnList = "actor"),
                @Index(name = "idx_audit_entity", columnList = "entityType, entityId"),
                @Index(name = "idx_audit_timestamp", columnList = "timestamp")
        })
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String actor;      // admin email

    @Column(nullable = false, length = 255)
    private String action;     // APPROVE_USER, SCHEDULE_PICKUP

    @Column(nullable = false, length = 100)
    private String entityType; // USER / REQUEST

    @Column(nullable = false)
    private Long entityId;

    @Column(nullable = false, updatable = false)
    private Instant timestamp;

    // ==========================
    // AUTO TIMESTAMP
    // ==========================
    @PrePersist
    public void prePersist() {
        this.timestamp = Instant.now();
    }

    // ==========================
    // GETTERS & SETTERS
    // ==========================

    public Long getId() {
        return id;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}