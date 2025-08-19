package com.aleks.linkrmix.auth.dto;

public class SmsSendResponse {
    private String phone;
    private String bizId;

    public SmsSendResponse() {}
    public SmsSendResponse(String phone, String bizId) {
        this.phone = phone;
        this.bizId = bizId;
    }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getBizId() { return bizId; }
    public void setBizId(String bizId) { this.bizId = bizId; }
}


