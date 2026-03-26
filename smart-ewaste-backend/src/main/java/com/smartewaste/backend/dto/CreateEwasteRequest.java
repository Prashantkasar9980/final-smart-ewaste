package com.smartewaste.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class CreateEwasteRequest {

    @NotBlank(message = "Device type is required")
    @Size(max = 255, message = "Device type cannot exceed 255 characters")
    private String deviceType;

    @Size(max = 255, message = "Brand cannot exceed 255 characters")
    private String brand;

    @Size(max = 255, message = "Model cannot exceed 255 characters")
    private String model;

    @NotBlank(message = "Device condition is required")
    @Size(max = 255, message = "Condition cannot exceed 255 characters")
    private String condition;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotBlank(message = "Pickup address is required")
    @Size(max = 1000, message = "Pickup address cannot exceed 1000 characters")
    private String pickupAddress;

    @Size(max = 2000, message = "Remarks cannot exceed 2000 characters")
    private String remarks;

    // New fields for Date & Time
    @NotNull(message = "Pickup date & time is required")
    private LocalDateTime pickupDateTime; // Combining Date and Time

    // Image Upload fields (Optional)
    private String imageName;
    private String imageType;
    private byte[] imageData;

    // ==========================
    // GETTERS & SETTERS
    // ==========================
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType != null ? deviceType.trim() : null; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand != null ? brand.trim() : null; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model != null ? model.trim() : null; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition != null ? condition.trim() : null; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress != null ? pickupAddress.trim() : null; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks != null ? remarks.trim() : null; }

    public LocalDateTime getPickupDateTime() { return pickupDateTime; }
    public void setPickupDateTime(LocalDateTime pickupDateTime) { this.pickupDateTime = pickupDateTime; }

    public String getImageName() { return imageName; }
    public void setImageName(String imageName) { this.imageName = imageName; }

    public String getImageType() { return imageType; }
    public void setImageType(String imageType) { this.imageType = imageType; }

    public byte[] getImageData() { return imageData; }
    public void setImageData(byte[] imageData) { this.imageData = imageData; }
}