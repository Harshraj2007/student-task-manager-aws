package com.studentmanager.backend.service;

import com.studentmanager.backend.dto.AssignmentRequest;
import com.studentmanager.backend.dto.DashboardSummary;
import com.studentmanager.backend.entity.Assignment;
import com.studentmanager.backend.repository.AssignmentRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    private final AssignmentRepository repository;

    public AssignmentService(AssignmentRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void seedInitialData() {
        if (repository.count() == 0) {
            repository.save(new Assignment(
                "AWS Cloud Architecture Diagram",
                "Cloud Computing",
                "Design 3-tier architecture diagram on draw.io showing EC2, RDS, VPC and S3/CloudFront.",
                LocalDate.now().plusDays(2),
                "HIGH",
                "IN_PROGRESS"
            ));

            repository.save(new Assignment(
                "PostgreSQL Relational Schema Setup",
                "Database Management Systems",
                "Write DDL scripts for student and assignment tables with proper foreign keys.",
                LocalDate.now().plusDays(5),
                "MEDIUM",
                "PENDING"
            ));

            repository.save(new Assignment(
                "Subnetting & Routing Lab Report",
                "Computer Networks",
                "Calculate CIDR blocks /24 to /28 and document router packet traces in Wireshark.",
                LocalDate.now().minusDays(1),
                "LOW",
                "COMPLETED"
            ));

            repository.save(new Assignment(
                "Spring Boot REST API Testing",
                "Web Development",
                "Create unit tests and verify Postman collection for all CRUD endpoints.",
                LocalDate.now().plusDays(7),
                "HIGH",
                "PENDING"
            ));
        }
    }

    public List<Assignment> getAll(String status, String priority, String subject) {
        if (status != null && !status.isBlank()) {
            return repository.findByStatusIgnoreCase(status.trim());
        }
        if (priority != null && !priority.isBlank()) {
            return repository.findByPriorityIgnoreCase(priority.trim());
        }
        if (subject != null && !subject.isBlank()) {
            return repository.findBySubjectContainingIgnoreCase(subject.trim());
        }
        return repository.findAllByOrderByDueDateAsc();
    }

    public Optional<Assignment> getById(Long id) {
        return repository.findById(id);
    }

    public Assignment create(AssignmentRequest request) {
        Assignment assignment = new Assignment(
            request.getTitle(),
            request.getSubject(),
            request.getDescription(),
            request.getDueDate(),
            request.getPriority(),
            request.getStatus()
        );
        return repository.save(assignment);
    }

    public Optional<Assignment> update(Long id, AssignmentRequest request) {
        return repository.findById(id).map(existing -> {
            existing.setTitle(request.getTitle());
            existing.setSubject(request.getSubject());
            existing.setDescription(request.getDescription());
            existing.setDueDate(request.getDueDate());
            if (request.getPriority() != null) existing.setPriority(request.getPriority());
            if (request.getStatus() != null) existing.setStatus(request.getStatus());
            return repository.save(existing);
        });
    }

    public boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public DashboardSummary getSummary() {
        List<Assignment> all = repository.findAll();
        long total = all.size();
        long pending = all.stream().filter(a -> "PENDING".equalsIgnoreCase(a.getStatus())).count();
        long inProgress = all.stream().filter(a -> "IN_PROGRESS".equalsIgnoreCase(a.getStatus())).count();
        long completed = all.stream().filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus())).count();
        long highPriority = all.stream().filter(a -> "HIGH".equalsIgnoreCase(a.getPriority())).count();
        return new DashboardSummary(total, pending, inProgress, completed, highPriority);
    }
}
