package com.smartewaste.backend.service;
import com.smartewaste.backend.repository.AuditLogRepository;
import com.smartewaste.backend.entity.AuditLog;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@Transactional
public class AuditService {

    private final AuditLogRepository repository;

    public AuditService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public void log(String actor, String action,
                    String entityType, Long entityId) {

        AuditLog log = new AuditLog();
        log.setActor(actor);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);

        repository.save(log);
    }
}