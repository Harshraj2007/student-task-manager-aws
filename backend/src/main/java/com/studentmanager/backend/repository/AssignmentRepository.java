package com.studentmanager.backend.repository;

import com.studentmanager.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByStatusIgnoreCase(String status);
    List<Assignment> findByPriorityIgnoreCase(String priority);
    List<Assignment> findBySubjectContainingIgnoreCase(String subject);
    List<Assignment> findAllByOrderByDueDateAsc();
}
