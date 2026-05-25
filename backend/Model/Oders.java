package com.sliceoclock.backend.model;

import jakarta.persistence.*;

@Entity
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String address;
    private double totalAmount;
    private String status;

    public Orders() {
    }
 public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
