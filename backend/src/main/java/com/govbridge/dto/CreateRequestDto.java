package com.govbridge.dto;

import com.govbridge.model.ServiceType;

public class CreateRequestDto {
    private ServiceType serviceType;

    public ServiceType getServiceType() { return serviceType; }
    public void setServiceType(ServiceType serviceType) { this.serviceType = serviceType; }
}
