package org.example.habittracker.home;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @RequestMapping("/task")
    public String tasks() {
        return "task";
    }

    @RequestMapping("/summary")
    public String summary() {
        return "summary";
    }

    @RequestMapping("/calendar")
    public String calendar() {
        return "calendar";
    }
}
