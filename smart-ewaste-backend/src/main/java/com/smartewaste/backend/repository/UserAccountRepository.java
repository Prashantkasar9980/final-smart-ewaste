package com.smartewaste.backend.repository;

import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByUsernameIgnoreCase(String username);

    Optional<UserAccount> findByEmailIgnoreCase(String email);

    List<UserAccount> findByStatus(UserStatus status);
}