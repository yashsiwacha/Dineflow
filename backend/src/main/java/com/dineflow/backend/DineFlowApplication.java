package com.dineflow.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class DineFlowApplication {
    public static void main(String[] args) {
        SpringApplication.run(DineFlowApplication.class, args);
    }
}
