package com.sliceoclock.backend.controller;

import com.sliceoclock.backend.model.Pizza;
import com.sliceoclock.backend.service.PizzaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pizzas")
@CrossOrigin
public class PizzaController {

    @Autowired
    private PizzaService pizzaService;

    @GetMapping
    public List<Pizza> getAllPizzas() {
        return pizzaService.getAllPizzas();
    }

    @PostMapping
    public Pizza addPizza(@RequestBody Pizza pizza) {
        return pizzaService.addPizza(pizza);
    }
}
