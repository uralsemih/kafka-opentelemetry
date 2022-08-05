package com.adidas.basketservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Products {
    private String title;
    private String desc;
    private String img;
    private List<String> categories;
    private String size;
    private String price;
}