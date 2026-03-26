package com.smartewaste.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ================= COMMON PRIVATE METHOD =================
    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    // ✅ SEND TEMP CREDENTIALS (ADMIN APPROVAL)
    public void sendCredentialsEmail(
            String email,
            String fullName,
            String tempPassword
    ) {
        String body =
                "Hello " + fullName + ",\n\n" +
                        "Your account has been approved by the admin.\n\n" +
                        "Temporary Password: " + tempPassword + "\n\n" +
                        "Please login and change your password immediately.\n\n" +
                        "Regards,\nSmart E-Waste Team";

        sendEmail(email,
                "Your Smart E-Waste Account Credentials",
                body);
    }

    // ✅ PASSWORD RESET CONFIRMATION
    public void sendPasswordChangedConfirmation(String email) {
        String body =
                "Your password has been changed successfully.\n\n" +
                        "If this wasn't you, please contact support immediately.";

        sendEmail(email,
                "Password Changed Successfully",
                body);
    }

    // ✅ FORGOT PASSWORD EMAIL
    public void sendPasswordResetEmail(String email, String resetLink) {
        String body =
                "Click the link below to reset your password:\n\n" +
                        resetLink + "\n\n" +
                        "This link will expire in 30 minutes.";

        sendEmail(email,
                "Reset Your Password",
                body);
    }

    // ✅ Request submitted email
    public void sendRequestSubmittedEmail(String email) {
        String body =
                "Dear User,\n\n" +
                        "Your E-waste request has been successfully submitted.\n\n" +
                        "We will process it soon. Thank you for choosing Smart E-Waste.\n\n" +
                        "Best Regards,\nSmart E-Waste Team";

        sendEmail(email,
                "E-waste Request Submitted",
                body);
    }

    // ✅ Request approved email
    public void sendRequestApprovedEmail(String toEmail) {
        String body =
                "Good news! Your e-waste pickup request has been approved.\n\n" +
                        "Our team will contact you soon.";

        sendEmail(toEmail,
                "E-waste Request Approved",
                body);
    }

    // ✅ Pickup Scheduled Email
    public void sendPickupScheduledEmail(String to, Instant scheduledAt) {

        DateTimeFormatter formatter = DateTimeFormatter
                .ofPattern("dd MMM yyyy hh:mm a")
                .withZone(ZoneId.systemDefault());

        String formattedDate = formatter.format(scheduledAt);

        String body =
                "Dear User,\n\n" +
                        "Your E-waste pickup has been scheduled on:\n\n" +
                        formattedDate + "\n\n" +
                        "Please be available at the pickup address.\n\n" +
                        "Regards,\nSmart E-Waste Team";

        sendEmail(to,
                "Your E-Waste Pickup is Scheduled",
                body);
    }
}