package com.smartewaste.backend.repository;
import com.smartewaste.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

}
