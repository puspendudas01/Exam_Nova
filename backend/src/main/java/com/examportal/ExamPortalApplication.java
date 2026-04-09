package com.examportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * ExamPortalApplication - Entry point for the Online Examination Portal backend.
 * Architecture: Modular Monolith. Each domain package owns its own
 * controller, service, repository, entities, and DTOs.
 */
@SpringBootApplication
@EnableScheduling
public class ExamPortalApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExamPortalApplication.class, args);
    }
}
