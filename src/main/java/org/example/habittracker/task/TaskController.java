package org.example.habittracker.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/task")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getTasks() {
        return taskService.getTasks();
    }

    @GetMapping(path = "{date}")
    public ResponseEntity<List<Task>> getTasksByDate(@PathVariable LocalDate date) {
        List<Task> tasks = taskService.getTasksByDate(date);
        if (tasks == null || tasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public void addTask(@RequestBody Task task) {
        taskService.addTask(task);
    }

    @DeleteMapping(path = "{taskId}")
    public void deleteTask(@PathVariable("taskId") Long TaskId) {
        taskService.deleteTask(TaskId);
    }

    @PutMapping(path = "{taskId}")
    public ResponseEntity<Void> updateTask(
            @PathVariable("taskId") Long taskId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String date) {
        LocalDate parsedDate = date != null ? LocalDate.parse(date) : null;
        taskService.updateTask(taskId, name, parsedDate);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "{taskId}/complete")
    public ResponseEntity<Void> completeTask(
            @PathVariable ("taskId") Long taskId)
    {
        taskService.completeTask(taskId);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/month/{date}")
    public ResponseEntity<List<Task>> getTasksFromMonth(@PathVariable LocalDate date) {
        LocalDate startOfMonth = date.withDayOfMonth(1);
        LocalDate endOfMonth = date.withDayOfMonth(date.lengthOfMonth());
        List<Task> tasks = taskService.getTasksByDateRange(startOfMonth, endOfMonth);
        if (tasks == null || tasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tasks);
    }
}
