package com.studentmanager.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class AssignmentRequest {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Subject cannot be blank")
    private String subject;

    private String description;

    private LocalDate dueDate;

    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH

    private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED

    public AssignmentRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
