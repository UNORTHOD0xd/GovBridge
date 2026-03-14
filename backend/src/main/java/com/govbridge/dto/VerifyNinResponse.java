package com.govbridge.dto;

import com.govbridge.model.Citizen;

public class VerifyNinResponse {
    private String id;
    private String ninHash;
    private String name;
    private String parish;
    private String dateOfBirth;
    private long jamdexBalance;
    private boolean verified;

    public static VerifyNinResponse from(Citizen c) {
        var r = new VerifyNinResponse();
        r.id = c.getId().toString();
        r.ninHash = c.getNinHash();
        r.name = c.getName();
        r.parish = c.getParish();
        r.dateOfBirth = c.getDateOfBirth().toString();
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

    public long getJamdexBalance() { return jamdexBalance; }
    public void setJamdexBalance(long jamdexBalance) { this.jamdexBalance = jamdexBalance; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
