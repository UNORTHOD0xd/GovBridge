package com.govbridge.dto;

import java.util.UUID;

public class PaymentResponseDto {
    private UUID paymentId;
    private String status;
    private String receiptId;
    private String txHash;
    private long remainingBalance;

    public PaymentResponseDto(UUID paymentId, String status, String receiptId, String txHash, long remainingBalance) {
        this.paymentId = paymentId;
        this.status = status;
        this.receiptId = receiptId;
        this.txHash = txHash;
        this.remainingBalance = remainingBalance;
    }

    public UUID getPaymentId() { return paymentId; }
    public void setPaymentId(UUID paymentId) { this.paymentId = paymentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReceiptId() { return receiptId; }
    public void setReceiptId(String receiptId) { this.receiptId = receiptId; }

    public String getTxHash() { return txHash; }
    public void setTxHash(String txHash) { this.txHash = txHash; }

    public long getRemainingBalance() { return remainingBalance; }
    public void setRemainingBalance(long remainingBalance) { this.remainingBalance = remainingBalance; }
}
