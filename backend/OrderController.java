package com.sliceoclock.backend.controller;

import com.sliceoclock.backend.model.Orders;
import com.sliceoclock.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Orders placeOrder(@RequestBody Orders orders) {
        return orderService.placeOrder(orders);
    }

    @GetMapping
    public List<Orders> getOrders() {
        return orderService.getAllOrders();
    }
}
