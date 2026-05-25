package com.sliceoclock.backend.model;

import jakarta.persistence.*;

@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pizzaName;
    private int quantity;
    private double totalPrice;

    public CartItem() {
    }

    public CartItem(String pizzaName, int quantity, double totalPrice) {
        this.pizzaName = pizzaName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPizzaName() {
        return pizzaName;
    }

    public void setPizzaName(String pizzaName) {
        this.pizzaName = pizzaName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalPrice() {
        return totalPrice;
    }
      public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
