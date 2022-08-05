# kafka-opentelemetry

```
COMPOSE_DOCKER_CLI_BUILD=1 docker-compose up --build
```

## Java 

```
request body
{
    "title": "shoes",
    "desc": "shoes",
    "img": "test4.svg",
    "categories": [
        "shoes",
        "man"
    ],
    "size": "M",
    "price": 50
}


/POST
http://localhost:8004/products
```

## NodeJS