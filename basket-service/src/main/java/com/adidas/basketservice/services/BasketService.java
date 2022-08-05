package com.adidas.basketservice.services;

import com.adidas.basketservice.model.Products;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Service
public class BasketService {

    private static final Logger logger = LoggerFactory.getLogger(BasketService.class);
    private final KafkaTemplate<String, Products> kafkaTemplate;

    @Value("${topic.name.producer}")
    private String topicName;

    private final WebClient webClient;

    public BasketService(KafkaTemplate<String, Products> kafkaTemplate, WebClient webClient){
        this.kafkaTemplate = kafkaTemplate;
        this.webClient = webClient;
    }

    public Mono<Products[]> listProducts(){
        return webClient
                .get()
                .uri("/products")
                .retrieve()
                .bodyToMono(Products[].class);
    }

    public Mono<Products> getProduct(String id) {
        return webClient
                .get()
                .uri("/products/find/{id}", id)
                .retrieve()
                .bodyToMono(Products.class);
    }

    public Mono<Products> updateProduct(String id, Products editProduct){
        return  webClient
                .patch()
                .uri("/products/{id}", id)
                .body(Mono.just(editProduct), Products.class)
                .retrieve()
                .bodyToMono(Products.class);
    }

    public void createProduct(Products product){
         kafkaTemplate.send(topicName, product);
    };

    public Mono<Void> deleteProduct(String id){
        return  webClient
                .delete()
                .uri("/products/{id}", id)
                .retrieve()
                .bodyToMono(Void.class);
    }
}