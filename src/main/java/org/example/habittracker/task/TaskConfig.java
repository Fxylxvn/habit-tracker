package org.example.habittracker.task;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Configuration
public class TaskConfig {

    @Bean
    CommandLineRunner runner(TaskRepository taskRepository) {
        return args -> {
            Task gym = new Task("Siłownia", LocalDate.now());
            Task java = new Task("Nauka Javy", LocalDate.now());
            Task call = new Task("Zadzwonić do mamy", LocalDate.now().plusDays(-1));
            call.setCompleted(true);
            Task shopping = new Task("Zrobić zakupy", LocalDate.now().plusDays(1));
            taskRepository.saveAll(List.of(gym, java, call, shopping));
        };
    }
}