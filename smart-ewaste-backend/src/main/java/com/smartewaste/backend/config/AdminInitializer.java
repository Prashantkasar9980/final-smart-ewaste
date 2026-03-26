package com.smartewaste.backend.config;

import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.UserStatus;
import com.smartewaste.backend.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner initAdmin(
            UserAccountRepository repository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            // ✅ EMAIL IS THE USERNAME (IMPORTANT)
            final String ADMIN_EMAIL = "admin@smartewaste.local";

            // ✅ check using EMAIL
            if (repository.findByEmailIgnoreCase(ADMIN_EMAIL).isPresent()) {
                return;
            }

            UserAccount admin = new UserAccount();
            admin.setEmail(ADMIN_EMAIL);
            admin.setUsername(ADMIN_EMAIL); // ✅ MUST MATCH EMAIL
            admin.setFullName("System Administrator");
            admin.setPhone("0000000000");
            admin.setAddress("System Generated");
            admin.setCity("Backend");

            // ✅ BCrypt password
            admin.setPassword(passwordEncoder.encode("Admin@123"));

            // ✅ VERIFIED so login allowed
            admin.setStatus(UserStatus.VERIFIED);
            admin.setMustResetPassword(false);
            admin.setCreatedAt(Instant.now());

            Set<String> roles = new HashSet<>();
            roles.add("ROLE_ADMIN");
            admin.setRoles(roles);

            repository.save(admin);

            System.out.println(
                    "✅ Default ADMIN created → email: admin@smartewaste.local | password: Admin@123"
            );
        };
    }
}
