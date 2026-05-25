package com.sliceoclock.backend.service;

import com.sliceoclock.backend.model.Pizza;
import com.sliceoclock.backend.repository.PizzaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PizzaService {

    @Autowired
    private PizzaRepository pizzaRepository;

    public List<Pizza> getAllPizzas() {
        return pizzaRepository.findAll();
    }

    public Pizza addPizza(Pizza pizza) {
        return pizzaRepository.save(pizza);
    }
}
