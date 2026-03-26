package com.smartewaste.backend.controller;

import com.smartewaste.backend.common.ApiResponse;
import com.smartewaste.backend.entity.EwasteRequest;
import com.smartewaste.backend.entity.UserAccount;
import com.smartewaste.backend.enums.RequestStatus;
import com.smartewaste.backend.service.EwasteRequestService;
import com.smartewaste.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    private final EwasteRequestService ewasteRequestService;
    private final UserService userService;

    public StaffController(EwasteRequestService ewasteRequestService, UserService userService) {
        this.ewasteRequestService = ewasteRequestService;
        this.userService = userService;
    }

    @GetMapping("/my-pickups")
    public ResponseEntity<ApiResponse<?>> getMyPickups(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        UserAccount user = userService.getProfile(userDetails.getUsername());
        
        // Use the full name of the logged-in user as the assigned personnel
        String personnelName = user.getFullName();
        
        Page<EwasteRequest> requests = ewasteRequestService.getStaffPickups(personnelName, page, size);
        return ResponseEntity.ok(ApiResponse.success("Pickups fetched successfully", requests));
    }

    @PutMapping("/pickups/{id}/status")
    public ResponseEntity<ApiResponse<?>> updatePickupStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        UserAccount user = userService.getProfile(userDetails.getUsername());
        RequestStatus status = RequestStatus.valueOf(body.get("status").toString());
        
        // Use the service to update status
        EwasteRequest updated = ewasteRequestService.updateStatus(id, status);
        
        return ResponseEntity.ok(ApiResponse.success("Pickup status updated successfully", updated));
    }
}
