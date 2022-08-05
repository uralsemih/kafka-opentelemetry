package com.adidas.basketservice.controller;

import com.adidas.basketservice.model.Products;
import com.adidas.basketservice.services.BasketService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/")
public class BasketController {

    private static final Logger logger = LoggerFactory.getLogger(BasketController.class);

    @Autowired
    private BasketService basketService;

    @GetMapping("/products")
    @ResponseStatus(code = HttpStatus.ACCEPTED)
    public Mono<Products[]> listProducts(){
        logger.info("GETTING ALL PRODUCTS");
        return basketService.listProducts();
    }

    @GetMapping("/products/find/{id}")
    @ResponseStatus(code = HttpStatus.ACCEPTED)
    public Mono<Products> getProduct(@PathVariable("id") String id){
        logger.info("GETTING PRODUCT WITH ID {}", id);
        return basketService.getProduct(id);
    }

    @PostMapping(value = "/products", produces = {"application/json"})
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createProduct(@RequestBody Products product ){
        logger.info("PRODUCT ADDED {}", product);
        basketService.createProduct(product);
    }

    @PatchMapping("/products/{id}")
    @ResponseStatus(code = HttpStatus.OK)
    public Mono<Products> updateProduct(@PathVariable("id") String id, @Validated @RequestBody Products editProduct){
        logger.info("PRODUCT UPDATED {}", editProduct);
        return  basketService.updateProduct(id, editProduct);
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(code = HttpStatus.OK)
    public Mono<Void> deleteProduct(@PathVariable("id") String id){
        logger.info("PRODUCT DELETED WITH ID {}", id);
        return basketService.deleteProduct(id);
    }
}