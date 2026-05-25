package com.sliceoclock.backend.service;

import com.sliceoclock.backend.model.Orders;
import com.sliceoclock.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Orders placeOrder(Orders orders) {
        return orderRepository.save(orders);
    }

    public List<Orders> getAllOrders() {
        return orderRepository.findAll();
    }
}
