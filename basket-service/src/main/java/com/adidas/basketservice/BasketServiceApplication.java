package com.adidas.basketservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class BasketServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(BasketServiceApplication.class, args);
    }
}






