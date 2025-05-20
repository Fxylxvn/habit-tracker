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
            Task gym2 = new Task("Siłownia", LocalDate.now().plusDays(-40));
            gym2.setCompleted(true);
            Task dentist = new Task("Wizyta u dentysty", LocalDate.now().plusDays(24));
            Task juvenalia = new Task("Juvenalia", LocalDate.of(2025, Month.MAY, 29));
            Task cv = new Task("Napisać CV", LocalDate.now().plusDays(-8));
            cv.setCompleted(true);
            Task cleaning = new Task("Sprzątanie", LocalDate.now().plusDays(-34));
            Task graphics = new Task("Dokończyć grafikę", LocalDate.now().plusDays(-18));
            Task shoes = new Task("Kupić buty", LocalDate.now().plusDays(26));
            Task shopping2 = new Task("Zrobić zakupy", LocalDate.now().plusDays(-9));
            shopping2.setCompleted(true);
            Task mail = new Task("Przeczytać maile", LocalDate.now().plusDays(-18));
            mail.setCompleted(true);
            Task trash = new Task("Wynieść śmieci", LocalDate.now().plusDays(-26));
            trash.setCompleted(true);
            Task finals = new Task("Nauka do sesji", LocalDate.of(2025, Month.JUNE, 3));
            Task birthday = new Task("Urodziny", LocalDate.of(2025, Month.MARCH, 24));
            birthday.setCompleted(true);
            Task spring = new Task("Nauka Spring Boota", LocalDate.of(2025, Month.MARCH, 20));
            spring.setCompleted(true);
            taskRepository.saveAll(List.of(gym, java, call, shopping, gym2, dentist, juvenalia, cv, cleaning, graphics, shoes, shopping2, mail, trash, finals, birthday, spring));
        };
    }
}