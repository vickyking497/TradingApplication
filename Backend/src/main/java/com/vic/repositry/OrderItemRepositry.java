package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.OrderItem;

public interface OrderItemRepositry extends JpaRepository<OrderItem, Long>{

}
