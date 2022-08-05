package com.adidas.basketservice.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.tcp.TcpClient;

import java.util.concurrent.TimeUnit;

@Configuration
public class WebClientConfiguration {

    public static final int TIMEOUT = 1000;
    private static final String BASE_URL = "http://product-service:8005";

    Logger logger = LoggerFactory.getLogger(WebClientConfiguration.class);

    @Bean
    public WebClient webClient(WebClient.Builder webClientBuilder) {
        final var tcpClient = TcpClient.create().option(ChannelOption.CONNECT_TIMEOUT_MILLIS, TIMEOUT).doOnConnected(connection -> {
            connection.addHandlerFirst(new ReadTimeoutHandler(TIMEOUT, TimeUnit.MILLISECONDS));
            connection.addHandlerFirst(new WriteTimeoutHandler(TIMEOUT, TimeUnit.MILLISECONDS));
        });

        return webClientBuilder
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
