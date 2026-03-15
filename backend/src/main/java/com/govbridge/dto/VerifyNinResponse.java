package com.govbridge.dto;

import com.govbridge.model.Citizen;

public class VerifyNinResponse {
    private String id;
    private String ninHash;
    private String name;
    private String parish;
    private String dateOfBirth;
    private String gender;
    private String trn;
    private String address;
    private String enrollmentDate;
    private String cardExpiry;
    private long jamdexBalance;
    private boolean verified;

    public static VerifyNinResponse from(Citizen c) {
        var r = new VerifyNinResponse();
        r.id = c.getId().toString();
        r.ninHash = c.getNinHash();
        r.name = c.getName();
        r.parish = c.getParish();
        r.dateOfBirth = c.getDateOfBirth().toString();
        r.gender = c.getGender();
        r.trn = c.getTrn();
        r.address = c.getAddress();
        r.enrollmentDate = c.getEnrollmentDate() != null ? c.getEnrollmentDate().toString() : null;
        r.cardExpiry = c.getCardExpiry() != null ? c.getCardExpiry().toString() : null;
        r.jamdexBalance = c.getJamdexBalance();
        r.verified = c.getVerified();
        return r;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNinHash() { return ninHash; }
    public void setNinHash(String ninHash) { this.ninHash = ninHash; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getParish() { return parish; }
    public void setParish(String parish) { this.parish = parish; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getTrn() { return trn; }
    public void setTrn(String trn) { this.trn = trn; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(String enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public String getCardExpiry() { return cardExpiry; }
    public void setCardExpiry(String cardExpiry) { this.cardExpiry = cardExpiry; }

    public long getJamdexBalance() { return jamdexBalance; }
    public void setJamdexBalance(long jamdexBalance) { this.jamdexBalance = jamdexBalance; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
