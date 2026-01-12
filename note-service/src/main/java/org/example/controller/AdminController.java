package org.example.controller;

import org.example.config.RabbitConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final RabbitTemplate rabbitTemplate;

    public AdminController(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @PostMapping("/broadcast-log")
    public String broadcastLogUpdate(@RequestParam String packageName, @RequestParam String level) {
        String message = packageName + ":" + level.toUpperCase();

        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE_NAME, "", message);

        return "Command sent to RabbitMQ: " + message;
    }
}