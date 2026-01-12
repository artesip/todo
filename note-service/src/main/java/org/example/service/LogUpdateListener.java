package org.example.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.logging.LogLevel;
import org.springframework.boot.logging.LoggingSystem;
import org.springframework.stereotype.Service;

@Service
public class LogUpdateListener {

    private final LoggingSystem loggingSystem = LoggingSystem.get(LogUpdateListener.class.getClassLoader());

    @RabbitListener(queues = "#{autoDeleteQueue.name}")
    public void receiveLogUpdate(String message) {
        try {
            String[] parts = message.split(":");
            String packageName = parts[0];
            LogLevel level = LogLevel.valueOf(parts[1].toUpperCase());

            loggingSystem.setLogLevel(packageName, level);
            System.out.println(">>>> [RABBITMQ] Updated log level for " + packageName + " to " + level);
        } catch (Exception e) {
            System.err.println("Error updating log level: " + e.getMessage());
        }
    }
}