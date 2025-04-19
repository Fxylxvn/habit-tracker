package org.example.habittracker.task;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    public void addTask(Task task) {
        taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        boolean exists = taskRepository.existsById(taskId);
        if (!exists) {
            throw new IllegalStateException("Task does not exist");
        }
        taskRepository.deleteById(taskId);
    }

    @Transactional
    public void updateTask(Long taskId, String name, LocalDate date) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalStateException("Task does not exist"));

        if(name != null && !Objects.equals(task.getName(), name)) {
            task.setName(name);
        }

        if(date != null && !Objects.equals(task.getDate(), date)) {
            task.setDate(date);
        }
    }

    @Transactional
    public void completeTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalStateException("Task does not exist"));
        task.setCompleted(!task.isCompleted());
    }

    public List<Task> getTasksByDate(LocalDate date) {
        return taskRepository.findByDate(date);
    }

    public List<Task> getTasksByDateRange(LocalDate start, LocalDate end) {
        return taskRepository.findByDateBetween(start, end);
    }
}
