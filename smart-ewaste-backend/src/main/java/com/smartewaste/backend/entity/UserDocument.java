package com.smartewaste.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_documents")
public class UserDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String fileName;

    private String contentType;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserAccount user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) { this.id = id; }

    public String getType() {
        return type;
    }

    public void setType(String type) { this.type = type; }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) { this.contentType = contentType; }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) { this.data = data; }

    public UserAccount getUser() {
        return user;
    }

    public void setUser(UserAccount user) { this.user = user; }
}